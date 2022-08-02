import { createContext } from 'react'
export type ProfileContextType = {
  showModal: React.Dispatch<React.SetStateAction<boolean>>
  hideModal: React.Dispatch<React.SetStateAction<boolean>>
  store: Record<string, unknown>
  setStore: React.Dispatch<React.SetStateAction<boolean>>
}

const profileContext: ProfileContextType = {
  showModal: () => {},
  hideModal: () => {},
  store: {},
  setStore: () => {},
}

export const ProfileContext = createContext<ProfileContextType>(profileContext)
