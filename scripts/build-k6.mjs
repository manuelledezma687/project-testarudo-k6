import { build } from 'esbuild';


await build({
  entryPoints: ['tests/smoke/smoke-test.ts'],
  bundle: true,
  platform: 'node',
  target: 'es2015',
  external: ['k6','k6/http', 'k6/metrics', 'k6/execution', 'k6/check', 'k6/*', 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js', 'https://jslib.k6.io/k6-summary/0.0.1/index.js'],
  outfile: 'dist/smoke-test.js',});

console.log('Build complete!');