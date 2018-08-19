const props = {
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,
  autoFocus: true,
  defaultValue: true
};
const r = new RegExp(`^${someVar + "d(?:angerouslySetInnerHTML|efaultValue)|autoFocus|children|ref|key"}$`);