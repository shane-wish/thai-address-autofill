export { getThaiAddressData, listProvinces, listDistricts, listSubdistricts } from './lib/data.js';
export {
  searchThaiAddresses,
  autofillThaiAddress,
  toQuickFillValue,
  validateThaiAddress,
} from './lib/search.js';
export { normalizeThai, normalizeThaiLoose, buildLabel } from './lib/normalize.js';

export type {
  ThaiAddressRecord,
  SearchOptions,
  SearchResult,
  AddressValue,
  QuickFillValue,
  AddressValidationResult,
  ProvinceOption,
  DistrictOption,
  SubdistrictOption,
} from './lib/types.js';
