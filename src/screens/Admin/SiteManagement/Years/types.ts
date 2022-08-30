import { FunctionComponent } from 'react'

type YearNodeProps = {
  title: string
  data?: unknown
}

export type YearNodeTemplateType = FunctionComponent<YearNodeProps>

export type SchoolYearItem = {
  open: string | undefined
  close: string | undefined
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
