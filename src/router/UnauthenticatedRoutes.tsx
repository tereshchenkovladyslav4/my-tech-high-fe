import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { NewParent } from '../screens/Applications/NewParent/NewParent'
import { CompleteAccount } from '../screens/CompleteAccount/CompleteAccount'
import { ForgotPassword } from '../screens/ForgotPassword/ForgotPassword'
import { ResetPassword } from '../screens/ForgotPassword/ResetPassword'
import { Login } from '../screens/Login/Login'
import { VerifyEmail } from '../screens/VerifyEmail/VerifyEmail'
import {
  APPLICATIONS,
  CONFIRM_EMAIL,
  DASHBOARD,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  EMAIL_VERIFICATION,
} from '../utils/constants'

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
    <Route exact path={EMAIL_VERIFICATION}>
      <VerifyEmail />
    </Route>
    <Route exact path={FORGOT_PASSWORD}>
      <ForgotPassword />
    </Route>
    <Route exact path={RESET_PASSWORD}>
      <ResetPassword />
    </Route>
    <Route>
      <Login />
    </Route>
  </Switch>
)
