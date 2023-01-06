import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { NewParent } from '../screens/Applications/NewParent/NewParent'
import { CompleteAccount } from '../screens/CompleteAccount/CompleteAccount'
import { ForgotPassword } from '../screens/ForgotPassword/ForgotPassword'
import { ResetPassword } from '../screens/ForgotPassword/ResetPassword'
import { Login } from '../screens/Login/Login'
import { VerifyEmail } from '../screens/VerifyEmail/VerifyEmail'

export const UnauthenticatedRoutes: React.FC = () => (
  <Switch>
    <Route exact path={MthRoute.DASHBOARD}>
      <Login />
    </Route>
    <Route exact path={MthRoute.APPLICATIONS}>
      <NewParent />
    </Route>
    <Route exact path={MthRoute.CONFIRM_EMAIL}>
      <CompleteAccount />
    </Route>
    <Route exact path={MthRoute.EMAIL_VERIFICATION}>
      <VerifyEmail />
    </Route>
    <Route exact path={MthRoute.FORGOT_PASSWORD}>
      <ForgotPassword />
    </Route>
    <Route exact path={MthRoute.RESET_PASSWORD}>
      <ResetPassword />
    </Route>
    <Route>
      <Login />
    </Route>
  </Switch>
)
