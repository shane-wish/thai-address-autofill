import {
  getThaiAddressData,
  listDistricts,
  listProvinces,
  listSubdistricts,
} from './data.js';
import { buildLabel, levenshteinDistance, normalizeThai, normalizeThaiLoose } from './normalize.js';
import type {
  AddressValidationResult,
  QuickFillValue,
  SearchField,
  SearchLocale,
  SearchOptions,
  SearchResult,
  ThaiAddressRecord,
} from './types.js';

type IndexedRecord = {
  record: ThaiAddressRecord;
  normalized: Record<SearchLocale, Record<SearchField, string>>;
  loose: Record<SearchLocale, Record<SearchField, string>>;
};

let cachedIndex: IndexedRecord[] | null = null;

function getSearchIndex(): IndexedRecord[] {
  if (cachedIndex) return cachedIndex;

  cachedIndex = getThaiAddressData().map((record) => ({
    record,
    normalized: {
      th: {
        subdistrict: normalizeThai(record.subdistrict),
        district: normalizeThai(record.district),
        province: normalizeThai(record.province),
        postalCode: record.postalCode,
      },
      en: {
        subdistrict: normalizeThai(record.subdistrictEn ?? ''),
        district: normalizeThai(record.districtEn ?? ''),
        province: normalizeThai(record.provinceEn ?? ''),
        postalCode: record.postalCode,
      },
    },
    loose: {
      th: {
        subdistrict: normalizeThaiLoose(record.subdistrict),
        district: normalizeThaiLoose(record.district),
        province: normalizeThaiLoose(record.province),
        postalCode: record.postalCode,
      },
      en: {
        subdistrict: normalizeThai(record.subdistrictEn ?? ''),
        district: normalizeThai(record.districtEn ?? ''),
        province: normalizeThai(record.provinceEn ?? ''),
        postalCode: record.postalCode,
      },
    },
  }));

  return cachedIndex;
}

function detectLocale(query: string): SearchLocale {
  return /[a-z]/i.test(query) ? 'en' : 'th';
}

function scoreField(
  query: string,
  looseQuery: string,
  field: SearchField,
  value: string,
  looseValue: string
): { score: number; matched: boolean } {
  if (!value) return { score: 0, matched: false };

  const weight =
    field === 'subdistrict'
      ? { exact: 170, starts: 126, includes: 72, looseBonus: 10, fuzzy: 34 }
      : field === 'district'
        ? { exact: 146, starts: 104, includes: 54, looseBonus: 8, fuzzy: 26 }
        : field === 'province'
          ? { exact: 128, starts: 92, includes: 46, looseBonus: 8, fuzzy: 20 }
          : { exact: 150, starts: 114, includes: 64, looseBonus: 6, fuzzy: 18 };

  if (value === query) return { score: weight.exact, matched: true };
  if (value.startsWith(query)) return { score: weight.starts, matched: true };
  if (value.includes(query)) return { score: weight.includes, matched: true };

  if (looseQuery && looseValue) {
    if (looseValue === looseQuery) return { score: weight.exact - weight.looseBonus, matched: true };
    if (looseValue.startsWith(looseQuery)) {
      const lengthPenalty = Math.max(looseValue.length - looseQuery.length, 0) * 4;
      return { score: weight.starts - weight.looseBonus - lengthPenalty, matched: true };
    }
    if (looseValue.includes(looseQuery)) {
      const lengthPenalty = Math.max(looseValue.length - looseQuery.length, 0) * 3;
      return { score: weight.includes - weight.looseBonus - lengthPenalty, matched: true };
    }

    const distance = levenshteinDistance(looseQuery, looseValue.slice(0, looseQuery.length));
    const maxDistance = looseQuery.length >= 6 ? 2 : 1;
    if (distance <= maxDistance) {
      const lengthPenalty = Math.max(looseValue.length - looseQuery.length, 0) * 5;
      return { score: Math.max(weight.fuzzy - distance * 6 - lengthPenalty, 6), matched: true };
    }
  }

  return { score: 0, matched: false };
}

function prefixSimilarity(query: string, value: string): number {
  let matches = 0;
  const max = Math.min(query.length, value.length);
  for (let index = 0; index < max; index += 1) {
    if (query[index] !== value[index]) break;
    matches += 1;
  }
  return matches;
}

function scoreRecord(query: string, locale: SearchLocale, record: IndexedRecord) {
  const looseQuery = locale === 'th' ? normalizeThaiLoose(query) : normalizeThai(query);
  let score = 0;
  const matchedOn: SearchResult['matchedOn'] = [];

  (['subdistrict', 'district', 'province', 'postalCode'] as SearchField[]).forEach((field) => {
    const result = scoreField(query, looseQuery, field, record.normalized[locale][field], record.loose[locale][field]);
    if (result.matched) {
      score += result.score;
      matchedOn.push(field);
    }
  });

  if (matchedOn.length >= 2) score += 18;
  if (matchedOn.includes('subdistrict') && matchedOn.includes('district')) score += 12;
  if (record.normalized[locale].postalCode === query) score += 16;

  const primaryField = matchedOn[0];
  if (primaryField) {
    score += prefixSimilarity(query, record.normalized[locale][primaryField]) * 2;
  }

  return { score, matchedOn };
}

export function searchThaiAddresses(options: SearchOptions, _mode: 'full' = 'full'): SearchResult[] {
  const { query, limit = 10 } = options;
  if (!query?.trim()) return [];

  const locale = detectLocale(query);
  const normalizedQuery = normalizeThai(query);

  return getSearchIndex()
    .map((entry) => {
      const { score, matchedOn } = scoreRecord(normalizedQuery, locale, entry);
      return {
        ...entry.record,
        label: buildLabel(entry.record),
        score,
        matchedOn,
      } satisfies SearchResult;
    })
    .filter((record) => record.score > 0)
    .sort((a, b) => {
      return (
        b.score - a.score ||
        a.subdistrict.localeCompare(b.subdistrict, 'th') ||
        a.district.localeCompare(b.district, 'th') ||
        a.province.localeCompare(b.province, 'th') ||
        a.postalCode.localeCompare(b.postalCode)
      );
    })
    .slice(0, limit);
}

export function autofillThaiAddress(query: string, _mode: 'full' = 'full'): SearchResult | null {
  const [first] = searchThaiAddresses({ query, limit: 1 }, 'full');
  return first ?? null;
}

export function toQuickFillValue(result: ThaiAddressRecord): QuickFillValue {
  return {
    subdistrict: result.subdistrict,
    district: result.district,
    province: result.province,
    postalCode: result.postalCode,
    provinceCode: result.provinceCode,
    provinceEn: result.provinceEn,
    districtCode: result.districtCode,
    districtEn: result.districtEn,
    subdistrictCode: result.subdistrictCode,
    subdistrictEn: result.subdistrictEn,
  };
}

export function validateThaiAddress(value: Partial<QuickFillValue>): AddressValidationResult {
  const issues: string[] = [];
  const normalized = {
    subdistrict: value.subdistrict?.trim(),
    district: value.district?.trim(),
    province: value.province?.trim(),
    postalCode: value.postalCode?.trim(),
  };

  if (!normalized.subdistrict) issues.push('Missing subdistrict');
  if (!normalized.district) issues.push('Missing district');
  if (!normalized.province) issues.push('Missing province');
  if (!normalized.postalCode) issues.push('Missing postalCode');
  if (normalized.postalCode && !/^\d{5}$/.test(normalized.postalCode)) issues.push('postalCode must be 5 digits');

  const matchedRecord =
    normalized.subdistrict && normalized.district && normalized.province
      ? getThaiAddressData().find(
          (record) =>
            record.subdistrict === normalized.subdistrict &&
            record.district === normalized.district &&
            record.province === normalized.province &&
            (!normalized.postalCode || record.postalCode === normalized.postalCode)
        )
      : undefined;

  if (!matchedRecord && !issues.length) {
    issues.push('Address combination does not exist in bundled dataset');
  }

  return {
    valid: issues.length === 0,
    issues,
    normalized,
    matchedRecord,
  };
}

export { listProvinces, listDistricts, listSubdistricts };
