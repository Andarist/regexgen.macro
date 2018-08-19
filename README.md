# regexgen.macro

[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)
[![npm version](https://img.shields.io/npm/v/regexgen.macro.svg)](https://www.npmjs.com/package/regexgen.macro)
[![Build Status](https://travis-ci.org/Andarist/regexgen.macro.svg?branch=master)](https://travis-ci.org/Andarist/regexgen.macro)
[![npm](https://img.shields.io/npm/dm/regexgen.macro.svg)](https://www.npmjs.com/package/regexgen.macro)

Convert your set of strings to optimized RegExps at build time with [babel macros](https://github.com/kentcdodds/babel-plugin-macros).

## Installation

```sh
npm install --save-dev regexgen.macro
```

## Usage

```js
import regexgen from 'regexgen.macro'

regexgen('children dangerouslySetInnerHTML key ref autoFocus defaultValue')

regexgen([
  'children',
  'dangerouslySetInnerHTML',
  'key',
  'ref',
  'autoFocus',
  'defaultValue',
])

regexgen({
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,
  autoFocus: true,
  defaultValue: true,
})
```
