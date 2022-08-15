import { FunctionComponent } from 'react'

type YearNodeProps = {
  title: string
  data?: unknown
}

export type YearNodeTemplateType = FunctionComponent<YearNodeProps>

export type SchoolYearItem = {
  open: Date | undefined
  close: Date | undefined
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
