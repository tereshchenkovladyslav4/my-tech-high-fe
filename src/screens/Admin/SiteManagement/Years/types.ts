import { FunctionComponent } from 'react'

type YearNodeProps = {
  title: string
  data?: unknown
}

export type YearNodeTemplateType = FunctionComponent<YearNodeProps>

export type SchoolYearItem = {
  open: Date
  close: Date
  status?: boolean
}

export type SchoolYearType = {
  schoolYearId: number
  schoolYearOpen: Date
  schoolYearClose: Date
  applicationsOpen: Date
  applicationsClose: Date
  midYearOpen: Date
  midYearClose: Date
  midYearStatus: boolean
}
