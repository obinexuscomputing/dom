import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const isProd = process.env.NODE_ENV === 'production';

export default [
  // JavaScript and ES Module Build
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
        tsconfig: './tsconfig.json', // Ensure TypeScript is configured properly
      }),
      isProd && terser(), // Minify in production
    ].filter(Boolean),
  },

  // Type Declaration Build
  {
    input: 'src/index.ts', // Use the same entry as JavaScript but process only type declarations
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];
