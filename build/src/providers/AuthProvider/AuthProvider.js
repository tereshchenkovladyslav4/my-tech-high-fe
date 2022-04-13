import React, {useState} from "../../../_snowpack/pkg/react.js";
import {AuthContext} from "./AuthContext.js";
export const AuthProvider = ({children}) => {
  const [credentials, setCredentials] = useState();
  const authContext = React.useMemo(() => ({
    credentials,
    setCredentials,
    signOut: async () => {
      setCredentials(void 0);
      localStorage.clear();
    }
  }), [credentials]);
  return /* @__PURE__ */ React.createElement(AuthContext.Provider, {
    value: authContext
  }, children);
};
