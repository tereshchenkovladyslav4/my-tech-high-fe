import React from "../../_snowpack/pkg/react.js";
import {Route, Switch} from "../../_snowpack/pkg/react-router-dom.js";
import {NewParent} from "../screens/Applications/NewParent/NewParent.js";
import {CompleteAccount} from "../screens/CompleteAccount/CompleteAccount.js";
import {Login} from "../screens/Login/Login.js";
import {APPLICATIONS, CONFIRM_EMAIL, DASHBOARD, FORGOT_PASSWORD, RESET_PASSWORD} from "../utils/constants.js";
import {ForgotPassword} from "../screens/ForgotPassword/ForgotPassword.js";
import {ResetPassword} from "../screens/ForgotPassword/ResetPassword.js";
export const UnauthenticatedRoutes = () => /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
  exact: true,
  path: DASHBOARD
}, /* @__PURE__ */ React.createElement(Login, null)), /* @__PURE__ */ React.createElement(Route, {
  exact: true,
  path: APPLICATIONS
}, /* @__PURE__ */ React.createElement(NewParent, null)), /* @__PURE__ */ React.createElement(Route, {
  exact: true,
  path: CONFIRM_EMAIL
}, /* @__PURE__ */ React.createElement(CompleteAccount, null)), /* @__PURE__ */ React.createElement(Route, {
  exact: true,
  path: FORGOT_PASSWORD
}, /* @__PURE__ */ React.createElement(ForgotPassword, null)), /* @__PURE__ */ React.createElement(Route, {
  exact: true,
  path: RESET_PASSWORD
}, /* @__PURE__ */ React.createElement(ResetPassword, null)));
