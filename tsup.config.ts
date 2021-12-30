import type { Options } from 'tsup';

export const tsup: Options = {
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2021',
  skipNodeModulesBundle: true,
  clean: true,
  dts: true
};
