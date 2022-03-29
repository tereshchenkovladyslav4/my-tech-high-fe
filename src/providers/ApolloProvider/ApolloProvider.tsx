import { setContext } from '@apollo/client/link/context'
import React, { ReactNode, useContext } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider as ApProvider, concat, HttpLink } from '@apollo/client'
import { AuthContext } from '../AuthProvider/AuthContext'

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  const { credentials } = useContext(AuthContext)
  const authLink = setContext((_, { headers }) => {
    const token = typeof credentials === 'string' ? credentials : localStorage.getItem('JWT')
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const httpLink = new HttpLink({ uri: import.meta.env.SNOWPACK_PUBLIC_API_URL })

  const client = new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false
    }),
    link: concat(authLink, httpLink),
  })
  return <ApProvider client={client}>{children}</ApProvider>
}
