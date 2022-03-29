import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { NewParent } from '../screens/Applications/NewParent/NewParent'
import { CompleteAccount } from '../screens/CompleteAccount/CompleteAccount'
import { Login } from '../screens/Login/Login'
import { APPLICATIONS, CONFIRM_EMAIL, DASHBOARD, FORGOT_PASSWORD, RESET_PASSWORD } from '../utils/constants'
import { ForgotPassword } from '../screens/ForgotPassword/ForgotPassword'
import { ResetPassword } from '../screens/ForgotPassword/ResetPassword'
export const UnauthenticatedRoutes: FunctionComponent = () => (
  <Switch>
    <Route exact path={DASHBOARD}>
      <Login />
    </Route>
    <Route exact path={APPLICATIONS}>
      <NewParent />
    </Route>
    <Route exact path={CONFIRM_EMAIL}>
      <CompleteAccount />
    </Route>
    <Route exact path={FORGOT_PASSWORD}>
      <ForgotPassword />
    </Route>
    <Route exact path={RESET_PASSWORD}>
      <ResetPassword />
    </Route>
  </Switch>
)
