import React, { FunctionComponent, useState } from 'react'
import { AuthContext } from './AuthContext'

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [credentials, setCredentials] = useState<string | undefined>()

  const authContext = React.useMemo(
    () => ({
      credentials,
      setCredentials,
      signOut: async () => {
        setCredentials(undefined)
        localStorage.clear()
      },
    }),
    [credentials],
  )
  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
}
