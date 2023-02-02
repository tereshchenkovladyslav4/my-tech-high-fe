export type StandardResponseOptionValues = { title: string; checked: boolean; extraText: string | null; abbr?: string }
export type StandardResponseOption = {
  type: 'MISSING_INFO' | 'AGE_ISSUE'
  default: string
  values: StandardResponseOptionValues[]
}

export type StandardResponseProps = {
  options: StandardResponseOption
  setTemplate: () => void
}
