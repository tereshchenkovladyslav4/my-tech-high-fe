import React, { createContext } from 'react'
import { Person, StudentType } from '../../screens/HomeroomStudentProfile/Student/types'
import { AccessType, RegionType, RoleType } from './types'
import { atom } from 'recoil'

export type UserInfo = {
  user_id?: number
  email?: string
  first_name?: string
  last_name?: string
  cookie?: string | undefined | null
  last_login?: Date | undefined | null
  avatar_url?: string | undefined | null
  level?: number | undefined | null
  role?: RoleType
  userRegion?: RegionType[]
  userAccess?: AccessType
  students?: StudentType[]
  profile?: Person
  selectedRegionId?: number
  masquerade: boolean
}

export type UserContextType = {
  me: UserInfo | null
  setMe: React.Dispatch<React.SetStateAction<UserInfo | null>>
}

const userContext: UserContextType = {
  me: null,
  setMe: (_) => {},
}

export type TabInfo = {
  currentTab?: number
}
export type TabContextType = {
  tab: TabInfo | null
  setTab: React.Dispatch<React.SetStateAction<TabInfo | null>>
  visitedTabs: number[]
  setVisitedTabs: React.Dispatch<React.SetStateAction<number[] | null>>
}

const tabContext: TabContextType = {
  tab: null,
  setTab: (_) => {},
  visitedTabs: [],
  setVisitedTabs: (_) => {},
}

export const UserContext = createContext(userContext)

export const TabContext = createContext(tabContext)

function parseUserRegionState() {
  try {
    return JSON.parse(localStorage.getItem('selectedRegion') || '')
  } catch (e) {
    return null
  }
}

export const userRegionState = atom<RegionType | null>({
  key: 'userRegion',
  default: parseUserRegionState(),
})
