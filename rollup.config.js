import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import svg from 'rollup-plugin-svg'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import scss from 'rollup-plugin-scss'

const isDevMode = Boolean(process.env.ROLLUP_WATCH)

export default [{
  input: 'src/plugin.ts',
  output: {
    file: pkg.main,
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayerImaPlugin',
    sourcemap: isDevMode
  },
  plugins: [
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg(),
    scss({
      output: 'dist/stroeervideoplayer-ima-plugin.min.css',
      outputStyle: 'compressed'
    })

  ]
},
{
  input: 'src/plugin.ts',
  output: [
    {
      file: pkg.module,
      exports: 'default',
      format: 'es',
      sourcemap: isDevMode
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg(),
    scss({
      output: 'dist/stroeervideoplayer-ima-plugin.min.css',
      outputStyle: 'compressed'
    })
  ]
}]
