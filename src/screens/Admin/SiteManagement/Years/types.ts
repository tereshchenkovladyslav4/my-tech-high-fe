import { FunctionComponent } from 'react'

type YearNodeProps = {
  title: string
  data?: any
}

export type YearNodeTemplateType = FunctionComponent<YearNodeProps>

export type SchoolYearItem = {
  open: string
  close: string
  status?: boolean
}

export type SchoolYearType = {
  schoolYearId: number
  schoolYearOpen: string
  schoolYearClose: string
  applicationsOpen: string
  applicationsClose: string
  midYearOpen: string
  midYearClose: string
  midYearStatus: boolean
}
