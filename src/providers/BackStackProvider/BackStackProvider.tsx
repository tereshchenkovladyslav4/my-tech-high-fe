import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import BackStackContext from './BackStackContext'
export default function BackStackProvider(props: { children: React.ReactNode }): React.ReactElement {
  const [paths, setPaths] = useState<string[]>([])
  const history = useHistory()
  useEffect(() => {
    if (history && !paths.length) {
      setPaths([history.location.pathname])
    }
  }, [history, paths.length])
  useEffect(() => {
    history?.listen((location, action) => {
      setPaths((paths): string[] => {
        switch (action) {
          case 'POP':
            return paths.slice(0, paths.length - 1)
          case 'PUSH':
            return [...paths, location.pathname]
          case 'REPLACE':
            return [...paths.slice(0, paths.length - 1), location.pathname]
          default:
            return paths
        }
      })
    })
  }, [history])
  return <BackStackContext.Provider value={paths}>{props.children}</BackStackContext.Provider>
}
