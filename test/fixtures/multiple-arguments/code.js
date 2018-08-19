import regexgen from 'regexgen.macro'

const obj = {
  foo: true,
  bar,
  '   baz  ': true,
}

const r = regexgen(
  obj,
  ['next', 'hah '],
  ` smth  `,
  'simple string   with words',
)
