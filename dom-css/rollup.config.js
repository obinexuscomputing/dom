import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const isProd = process.env.NODE_ENV === 'production';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs', // CommonJS for Node.js
        sourcemap: !isProd,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm', // ES module for modern bundlers
        sourcemap: !isProd,
      },
    ],
    plugins: [
      resolve(), // Resolve node_modules
      commonjs(), // Convert CommonJS to ES6
      typescript({
        tsconfig: './tsconfig.json', // Path to TypeScript config
        declaration: true, // Generate type declarations
        declarationDir: './dist/types', // Output directory for declarations
      }),
      isProd && terser(), // Minify in production
    ].filter(Boolean),
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }], // Bundle type declarations
    plugins: [dts()],
  },
];

export default config;
