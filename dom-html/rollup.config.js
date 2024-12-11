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
        declarationDir: './dist', // Must align with Rollup output paths
      }),
      isProd && terser(), // Minify in production
    ].filter(Boolean),
  },
  {
    input: 'dist/index.d.ts', // Adjusted path for type declaration bundling
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];

export default config;
