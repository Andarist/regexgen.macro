import regexgen from 'regexgen.macro'

const props = {
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,
  autoFocus: true,
  defaultValue: true,
}

const r = new RegExp(`^${someVar + regexgen(props)}$`)
