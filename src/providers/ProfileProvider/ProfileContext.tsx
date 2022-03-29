import { createContext } from 'react'
export type ProfileContextType = {
  showModal: React.Dispatch<React.SetStateAction<any>>
  hideModal: React.Dispatch<React.SetStateAction<boolean>>
  store: any
  setStore: React.Dispatch<React.SetStateAction<boolean>>
}

const profileContext: ProfileContextType = {
  showModal: (data) => {},
  hideModal: () => {},
  store: {},
  setStore: () => {},
}

export const ProfileContext = createContext<ProfileContextType>(profileContext)
