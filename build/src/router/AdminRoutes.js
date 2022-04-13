import React from "../../_snowpack/pkg/react.js";
import {Route, Switch} from "../../_snowpack/pkg/react-router-dom.js";
import {AdminDashboard} from "../screens/Admin/Dashboard/AdminDashboard.js";
import {
  APPLICATIONS,
  DASHBOARD,
  ENROLLMENT,
  ENROLLMENT_PACKETS,
  SETTINGS,
  USERS,
  EMAILTEMPLATES,
  SITE_MANAGEMENT
} from "../utils/constants.js";
import Enrollment from "../screens/Admin/Enrollment/Enrollment.js";
import {Applications} from "../screens/Admin/Applications/Applications.js";
import {EnrollmentPackets} from "../screens/Admin/EnrollmentPackets/EnrollmentPackets.js";
import {Users} from "../screens/Admin/Users/Users.js";
import AdminSettings from "../screens/Admin/Settings/AdminSettings.js";
import {EmailTemplatePage} from "../screens/Admin/SiteManagement/components/EmailTemplates/EmailTemplatePage.js";
import SiteManagement from "../screens/Admin/SiteManagement/SiteManagement.js";
export const AdminRoutes = () => {
  return /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: DASHBOARD
  }, /* @__PURE__ */ React.createElement(AdminDashboard, null)), /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: ENROLLMENT
  }, /* @__PURE__ */ React.createElement(Enrollment, null)), /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: ENROLLMENT_PACKETS
  }, /* @__PURE__ */ React.createElement(EnrollmentPackets, null)), /* @__PURE__ */ React.createElement(Route, {
    path: APPLICATIONS
  }, /* @__PURE__ */ React.createElement(Applications, null)), /* @__PURE__ */ React.createElement(Route, {
    path: SITE_MANAGEMENT
  }, /* @__PURE__ */ React.createElement(SiteManagement, null)), /* @__PURE__ */ React.createElement(Route, {
    path: USERS
  }, /* @__PURE__ */ React.createElement(Users, null)), /* @__PURE__ */ React.createElement(Route, {
    path: SETTINGS
  }, /* @__PURE__ */ React.createElement(AdminSettings, null)), /* @__PURE__ */ React.createElement(Route, {
    path: EMAILTEMPLATES
  }, /* @__PURE__ */ React.createElement(EmailTemplatePage, null)));
};
