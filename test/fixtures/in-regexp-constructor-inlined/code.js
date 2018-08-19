import regexgen from 'regexgen.macro'

const props = {
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,
  autoFocus: true,
  defaultValue: true,
}

const r1 = new RegExp('^(' + regexgen(props) + ')$')
const r2 = new RegExp(`^(${regexgen(props)})$`)
const withFlag = new RegExp(`^(${regexgen(props)})$`, 'i')
