export type SearchField = 'subdistrict' | 'district' | 'province' | 'postalCode';
export type SearchLocale = 'th' | 'en';

export interface ThaiAddressRecord {
  province: string;
  provinceEn?: string;
  provinceCode: number | null;
  district: string;
  districtEn?: string;
  districtCode: number | null;
  subdistrict: string;
  subdistrictEn?: string;
  subdistrictCode: number | null;
  postalCode: string;
}

export interface SearchOptions {
  query: string;
  limit?: number;
}

export interface SearchResult extends ThaiAddressRecord {
  label: string;
  score: number;
  matchedOn: SearchField[];
}

export interface AddressValue {
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface QuickFillValue extends AddressValue {
  provinceCode: number | null;
  provinceEn?: string;
  districtCode: number | null;
  districtEn?: string;
  subdistrictCode: number | null;
  subdistrictEn?: string;
}

export interface AddressValidationResult {
  valid: boolean;
  issues: string[];
  normalized: Partial<AddressValue>;
  matchedRecord?: ThaiAddressRecord;
}

export interface ProvinceOption {
  name: string;
  nameEn?: string;
  code: number | null;
}

export interface DistrictOption {
  name: string;
  nameEn?: string;
  code: number | null;
  province: string;
  provinceEn?: string;
  provinceCode: number | null;
}

export interface SubdistrictOption {
  name: string;
  nameEn?: string;
  code: number | null;
  district: string;
  districtEn?: string;
  districtCode: number | null;
  province: string;
  provinceEn?: string;
  provinceCode: number | null;
  postalCode: string;
}
