import { FunctionComponent, ReactNode } from 'react'

export type SchoolYears = {
  schoolYearId: number
  schoolYearOpen: string
  schoolYearClose: string
  grades: string
  birthDateCut: string
  specialEd: boolean
  specialEdOptions: string
  enrollmentPacket: boolean
}

export type ProgramSettingType = {
  name: string
  component: ReactNode
}

type ProgramSettingProps = {
  title: string
  data?: unknown
}

export type ProgramSettingChanged = {
  state: boolean
  stateLogo: boolean
  program: boolean
  counties: boolean
  schoolDistricts: boolean
  grades: boolean
  birth: boolean
  specialEd: boolean
  enrollment: boolean
}

export type FileDeleted = {
  county: boolean
  schoolDistrict: boolean
}

export type ProgramSettingTemplateType = FunctionComponent<ProgramSettingProps>
