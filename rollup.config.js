import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import scss from 'rollup-plugin-scss'
import pkg from './package.json'

const isDevMode = Boolean(process.env.ROLLUP_WATCH)
console.log('is dev mode', isDevMode)

export default [{
  input: 'src/plugin.ts',
  output: [{
    file: pkg.module,
    format: 'es',
    exports: 'named',
    sourcemap: isDevMode
  }, {
    file: pkg.main,
    format: 'umd',
    exports: 'named',
    name: 'StroeerVideoIMAPlugin',
    sourcemap: isDevMode
  }],
  plugins: [
    nodeResolve(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg(),
    scss({
      output: 'dist/stroeerVideoplayer-ima-plugin.min.css',
      outputStyle: 'compressed'
    })
  ]
}]
