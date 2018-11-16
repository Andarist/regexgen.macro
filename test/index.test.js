import * as path from 'path'
import pluginTester from 'babel-plugin-tester'
import macrosPlugin from 'babel-plugin-macros'

pluginTester({
  title: 'regexgen.macro',
  plugin: macrosPlugin,
  fixtures: `${__dirname}/fixtures`,
})
