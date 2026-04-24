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

let cachedData: ThaiAddressRecord[] | null = null;
let cachedProvinceOptions: ProvinceOption[] | null = null;
let cachedDistrictOptions: DistrictOption[] | null = null;
let cachedSubdistrictOptions: SubdistrictOption[] | null = null;

const toNullableCode = (value: number) => (value > 0 ? value : null);

export function getThaiAddressDataTh(): ThaiAddressRecord[] {
  if (cachedData) return cachedData;

  cachedData = THAI_ADDRESS_ROWS.map((row) => ({
    province: THAI_ADDRESS_PROVINCES[row[0]],
    provinceCode: toNullableCode(row[1]),
    district: THAI_ADDRESS_DISTRICTS[row[2]],
    districtCode: toNullableCode(row[3]),
    subdistrict: THAI_ADDRESS_SUBDISTRICTS[row[4]],
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

export function listProvincesTh(_locale: SearchLocale = 'th'): ProvinceOption[] {
  if (!cachedProvinceOptions) {
    cachedProvinceOptions = uniqueBy(
      getThaiAddressDataTh().map((record) => ({
        name: record.province,
        code: record.provinceCode,
      })),
      (item) => `${item.code}:${item.name}`
    ).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }

  return cachedProvinceOptions;
}

export function listDistrictsTh(province?: string, _locale: SearchLocale = 'th'): DistrictOption[] {
  if (!cachedDistrictOptions) {
    cachedDistrictOptions = uniqueBy(
      getThaiAddressDataTh().map((record) => ({
        name: record.district,
        code: record.districtCode,
        province: record.province,
        provinceCode: record.provinceCode,
      })),
      (item) => `${item.provinceCode}:${item.code}:${item.name}`
    ).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }

  return province ? cachedDistrictOptions.filter((item) => item.province === province) : cachedDistrictOptions;
}

export function listSubdistrictsTh(district?: string, _locale: SearchLocale = 'th'): SubdistrictOption[] {
  if (!cachedSubdistrictOptions) {
    cachedSubdistrictOptions = uniqueBy(
      getThaiAddressDataTh().map((record) => ({
        name: record.subdistrict,
        code: record.subdistrictCode,
        district: record.district,
        districtCode: record.districtCode,
        province: record.province,
        provinceCode: record.provinceCode,
        postalCode: record.postalCode,
      })),
      (item) => `${item.provinceCode}:${item.districtCode}:${item.code}:${item.postalCode}`
    ).sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }

  return district ? cachedSubdistrictOptions.filter((item) => item.district === district) : cachedSubdistrictOptions;
}
