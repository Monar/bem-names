import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const ENV = process.env.NODE_ENV;

export default {
  entry: 'src/index.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'window',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    (ENV === 'production' && uglify()),
  ],
  dest: ENV === 'production' ? './dist/bem-names.min.js'
    : './dist/bem-names.js',
};
