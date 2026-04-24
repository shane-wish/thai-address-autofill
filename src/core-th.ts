export { getThaiAddressDataTh as getThaiAddressData, listProvincesTh as listProvinces, listDistrictsTh as listDistricts, listSubdistrictsTh as listSubdistricts } from './lib/data-th.js';
export {
  searchThaiAddresses,
  autofillThaiAddress,
  toQuickFillValue,
  validateThaiAddress,
} from './lib/search-th.js';
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
