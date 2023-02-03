import { ReactNode } from 'react'
import { ReduceFunds } from '@mth/enums'

export type SchoolYears = {
  schoolYearId: number
  schoolYearOpen: string
  schoolYearClose: string
  grades: string
  birthDateCut: string
  specialEd: boolean
  specialEdOptions: string
  enrollmentPacket: boolean
  schedule: boolean
  diplomaSeeking: boolean
  testingPreference: boolean
  learningLogs: boolean
  learningLogsFirstSecondSemesters: boolean
  reimbursements: ReduceFunds
  requireSoftware: boolean
  directOrders: ReduceFunds
}

export type ProgramSettingType = {
  name: string
  component: ReactNode
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
  schedule?: boolean
  diplomaSeeking?: boolean
  testingPreference?: boolean
  learningLogs: boolean
  learningLogsFirstSecondSemesters: boolean
  reimbursements: boolean
  requireSoftware: boolean
  directOrders: boolean
}

export type FileDeleted = {
  county: boolean
  schoolDistrict: boolean
}
