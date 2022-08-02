import { createContext } from 'react'
export type AuthContextType = {
  credentials: string | undefined | null
  signOut: () => void
  setCredentials: React.Dispatch<React.SetStateAction<string | undefined>>
}

const authContext: AuthContextType = {
  credentials: undefined,
  signOut: () => {},
  setCredentials: () => {},
}

export const AuthContext = createContext<AuthContextType>(authContext)

//import React, { useState } from 'react'

//export const AuthContext = () => {

//	const authContext = React.useMemo(() => {
//		const [credentials, setCredentials] = useState<any | undefined>()

//    return {
//      credentials,
//      signIn: (credentials: Credentials) => {
//        getMe(credentials).then(async (userData) => {
//          await setAsyncStorageItem('me', JSON.stringify(userData))
//          setCredentials(credentials)
//        })
//      },
//      signOut: async () => {
//        setCredentials(undefined)
//				localStorage.clear()
//      },
//    }
//  }, [credentials])
//	return (
//		<div>

//		</div>
//	)
//}
