const THAI_TONE_MARKS = /[\u0E47-\u0E4E]/g;
const THAI_VOWEL_MARKS = /[\u0E31\u0E34-\u0E3A\u0E47]/g;
const THAI_PREFIXES = [/^จ\.?/u, /^จังหวัด/u, /^อ\.?/u, /^อำเภอ/u, /^เขต/u, /^ต\.?/u, /^ตำบล/u, /^แขวง/u];
const THAI_ALIASES: Array<[RegExp, string]> = [
  [/^กทม$/u, 'กรุงเทพมหานคร'],
  [/^กรุงเทพ$/u, 'กรุงเทพมหานคร'],
];

export function normalizeThai(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFC')
    .replace(/[()\[\]{}.,/\\-]+/g, ' ')
    .replace(/\s+/g, '');
}

export function normalizeThaiLoose(text: string): string {
  let normalized = normalizeThai(text)
    .replace(THAI_TONE_MARKS, '')
    .replace(THAI_VOWEL_MARKS, '');

  for (const prefix of THAI_PREFIXES) {
    normalized = normalized.replace(prefix, '');
  }

  for (const [pattern, replacement] of THAI_ALIASES) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

export function buildLabel(parts: {
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}): string {
  return `${parts.subdistrict} • ${parts.district} • ${parts.province} • ${parts.postalCode}`;
}

export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 0; i < a.length; i += 1) {
    current[0] = i + 1;

    for (let j = 0; j < b.length; j += 1) {
      const cost = a[i] === b[j] ? 0 : 1;
      current[j + 1] = Math.min(current[j] + 1, previous[j + 1] + 1, previous[j] + cost);
    }

    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}
