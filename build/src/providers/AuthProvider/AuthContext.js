import {createContext} from "../../../_snowpack/pkg/react.js";
const authContext = {
  credentials: void 0,
  signOut: () => {
  },
  setCredentials: (_) => {
  }
};
export const AuthContext = createContext(authContext);
