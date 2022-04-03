import React, { createContext } from 'react'
import { StudentType } from '../../screens/HomeroomStudentProfile/Student/types'
import { UserInfo } from '../UserContext/UserProvider'

export type EnrollmentPacketContextType = {
  me?: UserInfo,
  setMe?: React.Dispatch<React.SetStateAction<UserInfo | null>>
  currentTab: number
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>,
  packetId: number
  setPacketId: React.Dispatch<React.SetStateAction<number>>,
  student:  StudentType,
  disabled?: boolean,
  visitedTabs?: Number[],
  setVisitedTabs: React.Dispatch<React.SetStateAction<number[]>>,
}

const enrollmentContext: EnrollmentPacketContextType = {
  me: undefined,
  setMe: (_) => {},
  currentTab: 0,
  setCurrentTab: (_) => {},
  packetId: 0,
  setPacketId: (_) => {},
  student: undefined,
  disabled: false,
  visitedTabs: [],
  setVisitedTabs: (_) => {},
}

export const EnrollmentContext = createContext(enrollmentContext)
