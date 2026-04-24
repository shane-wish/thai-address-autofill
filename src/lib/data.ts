import type {
  DistrictOption,
  ProvinceOption,
  SearchLocale,
  SubdistrictOption,
  ThaiAddressRecord,
} from './types.js';
import {
  THAI_ADDRESS_DISTRICTS,
  THAI_ADDRESS_PROVINCES,
  THAI_ADDRESS_ROWS,
  THAI_ADDRESS_SUBDISTRICTS,
} from '../data/compact-data-th.js';
import {
  THAI_ADDRESS_DISTRICTS_EN,
  THAI_ADDRESS_PROVINCES_EN,
  THAI_ADDRESS_SUBDISTRICTS_EN,
} from '../data/compact-data-en.js';

let cachedData: ThaiAddressRecord[] | null = null;
let cachedProvinceOptions: ProvinceOption[] | null = null;
let cachedDistrictOptions: DistrictOption[] | null = null;
let cachedSubdistrictOptions: SubdistrictOption[] | null = null;

const toNullableCode = (value: number) => (value > 0 ? value : null);
const getEnglishValue = (values: readonly string[], index: number) => values[index] || undefined;

export function getThaiAddressData(): ThaiAddressRecord[] {
  if (cachedData) return cachedData;

  cachedData = THAI_ADDRESS_ROWS.map((row) => ({
    province: THAI_ADDRESS_PROVINCES[row[0]],
    provinceEn: getEnglishValue(THAI_ADDRESS_PROVINCES_EN, row[0]),
    provinceCode: toNullableCode(row[1]),
    district: THAI_ADDRESS_DISTRICTS[row[2]],
    districtEn: getEnglishValue(THAI_ADDRESS_DISTRICTS_EN, row[2]),
    districtCode: toNullableCode(row[3]),
    subdistrict: THAI_ADDRESS_SUBDISTRICTS[row[4]],
    subdistrictEn: getEnglishValue(THAI_ADDRESS_SUBDISTRICTS_EN, row[4]),
    subdistrictCode: toNullableCode(row[5]),
    postalCode: String(row[6]).padStart(5, '0'),
  }));

  return cachedData;
}

function uniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyOf(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function listProvinces(locale: SearchLocale = 'th'): ProvinceOption[] {
  if (!cachedProvinceOptions) {
    cachedProvinceOptions = uniqueBy(
      getThaiAddressData().map((record) => ({
        name: record.province,
        nameEn: record.provinceEn,
        code: record.provinceCode,
      })),
      (item) => `${item.code}:${item.name}`
    ).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }

  if (locale === 'en') {
    return cachedProvinceOptions.map((item) => ({
      ...item,
      name: item.nameEn ?? item.name,
      nameEn: item.nameEn,
    }));
  }

  return cachedProvinceOptions;
}

export function listDistricts(province?: string, locale: SearchLocale = 'th'): DistrictOption[] {
  if (!cachedDistrictOptions) {
    cachedDistrictOptions = uniqueBy(
      getThaiAddressData().map((record) => ({
        name: record.district,
        nameEn: record.districtEn,
        code: record.districtCode,
        province: record.province,
        provinceEn: record.provinceEn,
        provinceCode: record.provinceCode,
      })),
      (item) => `${item.provinceCode}:${item.code}:${item.name}`
    ).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }

  const filtered = province
    ? cachedDistrictOptions.filter((item) => item.province === province || item.provinceEn === province)
    : cachedDistrictOptions;

  if (locale === 'en') {
    return filtered.map((item) => ({
      ...item,
      name: item.nameEn ?? item.name,
      province: item.provinceEn ?? item.province,
    }));
  }

  return filtered;
}

export function listSubdistricts(district?: string, locale: SearchLocale = 'th'): SubdistrictOption[] {
  if (!cachedSubdistrictOptions) {
    cachedSubdistrictOptions = uniqueBy(
      getThaiAddressData().map((record) => ({
        name: record.subdistrict,
        nameEn: record.subdistrictEn,
        code: record.subdistrictCode,
        district: record.district,
        districtEn: record.districtEn,
        districtCode: record.districtCode,
        province: record.province,
        provinceEn: record.provinceEn,
        provinceCode: record.provinceCode,
        postalCode: record.postalCode,
      })),
      (item) => `${item.provinceCode}:${item.districtCode}:${item.code}:${item.postalCode}`
    ).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }

  const filtered = district
    ? cachedSubdistrictOptions.filter((item) => item.district === district || item.districtEn === district)
    : cachedSubdistrictOptions;

  if (locale === 'en') {
    return filtered.map((item) => ({
      ...item,
      name: item.nameEn ?? item.name,
      district: item.districtEn ?? item.district,
      province: item.provinceEn ?? item.province,
    }));
  }

  return filtered;
}
