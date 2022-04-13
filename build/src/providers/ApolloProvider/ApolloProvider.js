import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';

import {setContext} from "../../../_snowpack/pkg/@apollo/client/link/context.js";
import React, {useContext} from "../../../_snowpack/pkg/react.js";
import {ApolloClient, InMemoryCache, ApolloProvider as ApProvider, concat, HttpLink} from "../../../_snowpack/pkg/@apollo/client.js";
import {AuthContext} from "../AuthProvider/AuthContext.js";
export const ApolloProvider = ({children}) => {
  const {credentials} = useContext(AuthContext);
  const authLink = setContext((_, {headers}) => {
    const token = typeof credentials === "string" ? credentials : localStorage.getItem("JWT");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });
  const httpLink = new HttpLink({uri: __SNOWPACK_ENV__.SNOWPACK_PUBLIC_API_URL});
  const client = new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false
    }),
    link: concat(authLink, httpLink)
  });
  return /* @__PURE__ */ React.createElement(ApProvider, {
    client
  }, children);
};
