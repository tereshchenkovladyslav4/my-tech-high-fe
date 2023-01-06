export type StateCodeType = {
  stateCodesId?: number
  titleId?: number
  titleName?: string
  stateCode?: string
  grade?: string
  subject?: string
  teacher?: string
}

export type StateCodeField = {
  state_codes_id?: number
  TitleId?: number
  title_name?: string
  state_code?: string
  grade?: string
  subject?: string
  teacher?: string
  SchoolYearId?: number
}

export type StateCodesTemplateType = {
  'Title ID'?: string
  Grade?: string
  'State Code'?: string
  Teacher?: string
  Subject?: string
  Title?: string
}
