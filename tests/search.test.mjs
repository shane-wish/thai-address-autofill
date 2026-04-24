import test from 'node:test';
import assert from 'node:assert/strict';
import {
  autofillThaiAddress,
  listDistricts,
  listProvinces,
  listSubdistricts,
  searchThaiAddresses,
  toQuickFillValue,
  validateThaiAddress,
} from '../dist/index.js';
import {
  autofillThaiAddress as autofillThaiAddressTh,
  listDistricts as listDistrictsTh,
  listProvinces as listProvincesTh,
  listSubdistricts as listSubdistrictsTh,
  searchThaiAddresses as searchThaiAddressesTh,
  validateThaiAddress as validateThaiAddressTh,
} from '../dist/index-th.js';

test('searchThaiAddresses returns ranked matches', () => {
  const results = searchThaiAddresses({ query: 'ปทุมวัน', limit: 5 });
  assert.ok(results.length > 0);
  assert.equal(results[0].subdistrict, 'ปทุมวัน');
});

test('autofillThaiAddress finds a valid result', () => {
  const result = autofillThaiAddress('ลุมพินี');
  assert.ok(result);
  assert.equal(result?.district, 'ปทุมวัน');
  assert.equal(result?.province, 'กรุงเทพมหานคร');
});

test('toQuickFillValue shapes the selected record', () => {
  const result = autofillThaiAddress('ลุมพินี');
  assert.ok(result);
  const value = toQuickFillValue(result);
  assert.equal(value.subdistrict, 'ลุมพินี');
  assert.equal(value.subdistrictEn, 'Lumphini');
  assert.equal(value.postalCode, result.postalCode);
  assert.ok('subdistrictCode' in value);
});

test('fuzzy matching tolerates minor typos and omitted prefixes', () => {
  const typoResults = searchThaiAddresses({ query: 'ลุมพิี', limit: 5 });
  assert.ok(typoResults.some((item) => item.subdistrict === 'ลุมพินี'));

  const withoutProvincePrefix = autofillThaiAddress('จกรุงเทพมหานคร');
  assert.ok(withoutProvincePrefix);
  assert.equal(withoutProvincePrefix?.province, 'กรุงเทพมหานคร');
});

test('postal code query still returns matching rows first', () => {
  const results = searchThaiAddresses({ query: '10330', limit: 3 });
  assert.ok(results.length > 0);
  assert.equal(results[0].postalCode, '10330');
});

test('common Bangkok alias still resolves correctly', () => {
  const result = autofillThaiAddress('กทม');
  assert.ok(result);
  assert.equal(result?.province, 'กรุงเทพมหานคร');
});

test('english queries resolve against english names in full build', () => {
  const results = searchThaiAddresses({ query: 'Lumphini', limit: 5 });
  assert.ok(results.length > 0);
  assert.equal(results[0].subdistrict, 'ลุมพินี');
  assert.equal(results[0].subdistrictEn, 'Lumphini');
  assert.equal(results[0].districtEn, 'Pathum Wan');
  assert.equal(results[0].provinceEn, 'Bangkok');
});

test('english province query finds bangkok in full build', () => {
  const result = autofillThaiAddress('Bangkok');
  assert.ok(result);
  assert.equal(result?.province, 'กรุงเทพมหานคร');
  assert.equal(result?.provinceEn, 'Bangkok');
});

test('thai-only build rejects english queries', () => {
  const results = searchThaiAddressesTh({ query: 'Bangkok', limit: 5 });
  assert.equal(results.length, 0);
  assert.equal(autofillThaiAddressTh('Bangkok'), null);
});

test('thai-only build exposes list helpers', () => {
  const provinces = listProvincesTh();
  const districts = listDistrictsTh('กรุงเทพมหานคร');
  const subdistricts = listSubdistrictsTh('ปทุมวัน');

  assert.ok(provinces.some((item) => item.name === 'กรุงเทพมหานคร'));
  assert.ok(districts.some((item) => item.name === 'ปทุมวัน'));
  assert.ok(subdistricts.some((item) => item.name === 'ลุมพินี'));
  assert.ok(provinces.every((item) => !('nameEn' in item) || item.nameEn === undefined));
});

test('list helpers expose provinces districts and subdistricts', () => {
  const provinces = listProvinces();
  const districts = listDistricts('กรุงเทพมหานคร');
  const subdistricts = listSubdistricts('ปทุมวัน');

  assert.ok(provinces.some((item) => item.name === 'กรุงเทพมหานคร'));
  assert.ok(districts.some((item) => item.name === 'ปทุมวัน'));
  assert.ok(subdistricts.some((item) => item.name === 'ลุมพินี'));
});

test('validateThaiAddress accepts valid combinations', () => {
  const result = validateThaiAddress({
    subdistrict: 'ลุมพินี',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    postalCode: '10330',
  });

  assert.equal(result.valid, true);
  assert.equal(result.issues.length, 0);
  assert.equal(result.matchedRecord?.subdistrict, 'ลุมพินี');
});

test('validateThaiAddress rejects invalid combinations', () => {
  const result = validateThaiAddress({
    subdistrict: 'ลุมพินี',
    district: 'เชียงใหม่',
    province: 'กรุงเทพมหานคร',
    postalCode: '10330',
  });

  assert.equal(result.valid, false);
  assert.ok(result.issues.includes('Address combination does not exist in bundled dataset'));
});

test('thai-only validation accepts valid combinations', () => {
  const result = validateThaiAddressTh({
    subdistrict: 'ลุมพินี',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    postalCode: '10330',
  });

  assert.equal(result.valid, true);
  assert.equal(result.matchedRecord?.subdistrict, 'ลุมพินี');
  assert.equal(result.matchedRecord?.subdistrictEn, undefined);
});
