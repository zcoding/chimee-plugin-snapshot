// rollup build
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/chimee-plugin-snapshot-iife.js',
      format: 'iife',
      name: 'ChimeeSnapshot'
    },
    {
      file: 'dist/chimee-plugin-snapshot.js',
      format: 'es'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
