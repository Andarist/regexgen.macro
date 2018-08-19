import * as path from 'path'
import pluginTester from 'babel-plugin-tester'
import macrosPlugin from 'babel-plugin-macros'
import { addAlias } from 'module-alias'

addAlias('regexgen.macro', path.join(__dirname, '..'))

pluginTester({
  title: 'regexgen.macro',
  plugin: macrosPlugin,
  fixtures: `${__dirname}/fixtures`,
})
