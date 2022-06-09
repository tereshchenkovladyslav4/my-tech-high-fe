import React, { FunctionComponent, ReactNode } from 'react'

export type SchoolYears = {
  schoolYearId: number
  schoolYearOpen: string
  schoolYearClose: string
  grades: string
  birthDateCut: string
  specialEd: boolean
}

export type ProgramSettingType = {
  name: string
  component: ReactNode
}

type ProgramSettingProps = {
  title: string
  data?: any
}

export type ProgramSettingTemplateType = FunctionComponent<ProgramSettingProps>
