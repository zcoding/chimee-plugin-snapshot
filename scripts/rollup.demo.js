// rollup build
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'examples/simple/chimee-plugin-snapshot.js',
      format: 'iife',
      name: 'ChimeeSnapshot'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
