import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'

export default [{
  input: 'src/plugin.ts',
  output: {
    file: 'dist/StroeerVideoplayer-ima-plugin.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayerIMAPlugin',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    typescript(),
    json(),
    svg()
  ]
}]
