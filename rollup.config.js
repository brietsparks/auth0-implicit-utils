import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/index.js',
    external: ['auth0-js', 'jwt-decode'],
    output: {
      name: 'auth0ImplicitUtils',
      file: 'dist/index.js',
      format: 'umd',
      globals: {
        'auth0-js': 'auth0',
        'jwt-decode': 'decodeJwt'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ]
  },
];
