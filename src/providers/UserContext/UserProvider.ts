import React, { createContext } from 'react'
import { Person, StudentType } from '../../screens/HomeroomStudentProfile/Student/types';
import { AccessType, RegionType, RoleType } from './types'

export type UserInfo = {
  user_id?: number
  email?: string
  first_name?: string;
  last_name?: string;
  cookie?: string | undefined | null;
  last_login?: Date | undefined | null;
  avatar_url?: string | undefined | null;
  level?: number | undefined | null;
  role?: RoleType;
  userRegion?: RegionType,
  userAccess?: AccessType,
  students?: StudentType[]
  profile?: Person
}

export type UserContextType = {
  me: UserInfo | null
  setMe: React.Dispatch<React.SetStateAction<UserInfo | null>>
}

const userContext: UserContextType = {
  me: null,
  setMe: (_) => { },
}

export const UserContext = createContext(userContext)
