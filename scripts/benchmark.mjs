import { performance } from 'node:perf_hooks';
import { searchThaiAddresses as searchFull, validateThaiAddress } from '../dist/core.js';
import { searchThaiAddresses as searchTh } from '../dist/core-th.js';

const benchmarkNotes = {
  posture: 'neutral ecosystem sanity checks for release review',
  userFacingRule: 'avoid competitor framing and unnecessary package callouts',
};

const queries = ['ลุมพินี', 'กทม', '10330', 'Lumphini', 'Bangkok'];

function run(name, fn, iterations = 300) {
  const start = performance.now();
  for (let index = 0; index < iterations; index += 1) fn();
  const total = performance.now() - start;
  return {
    name,
    iterations,
    totalMs: Number(total.toFixed(2)),
    avgMs: Number((total / iterations).toFixed(4)),
  };
}

const results = [
  ...queries.map((query) => run(`full search: ${query}`, () => searchFull({ query, limit: 8 }))),
  ...queries.filter((query) => !/[a-z]/i.test(query)).map((query) => run(`th search: ${query}`, () => searchTh({ query, limit: 8 }))),
  run('validate', () =>
    validateThaiAddress({
      subdistrict: 'ลุมพินี',
      district: 'ปทุมวัน',
      province: 'กรุงเทพมหานคร',
      postalCode: '10330',
    })
  ),
];

console.log(JSON.stringify({ benchmarkNotes, results }, null, 2));
