import type { ThaiAddressRow } from '../data/compact-data-th.js';

export function decodePackedList(packed: string): readonly string[] {
  return packed ? packed.split('\n') : [];
}

export function decodePackedRows(packed: string): readonly ThaiAddressRow[] {
  if (!packed) return [];

  return packed.split('|').map((row) => {
    const [provinceNameIndex, provinceCode, districtNameIndex, districtCode, subdistrictNameIndex, subdistrictCode, postalCode] = row
      .split('.')
      .map((value) => parseInt(value, 36));

    return [
      provinceNameIndex,
      provinceCode,
      districtNameIndex,
      districtCode,
      subdistrictNameIndex,
      subdistrictCode,
      postalCode,
    ] satisfies ThaiAddressRow;
  });
}
