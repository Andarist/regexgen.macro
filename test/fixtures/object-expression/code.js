import regexgen from 'regexgen.macro'

const r = regexgen({
  foo: true,
  bar,
  '   baz  ': true,
})
