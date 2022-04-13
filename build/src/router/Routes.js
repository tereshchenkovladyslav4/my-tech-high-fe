import {find} from "../../_snowpack/pkg/lodash.js";
import React, {useContext, useState} from "../../_snowpack/pkg/react.js";
import {Route, Switch} from "../../_snowpack/pkg/react-router-dom.js";
import {UserContext} from "../providers/UserContext/UserProvider.js";
import {AdminDashboard} from "../screens/Admin/Dashboard/AdminDashboard.js";
import AdminEnrollment from "../screens/Admin/Enrollment/Enrollment.js";
import {Users} from "../screens/Admin/Users/Users.js";
import {Applications} from "../screens/Applications/Applications.js";
import {Dashboard} from "../screens/Dashboard/Dashboard.js";
import {Enrollment} from "../screens/Enrollment/Enrollment.js";
import {Homeroom} from "../screens/Homeroom/Homeroom.js";
import {HomeroomStudentProfile} from "../screens/HomeroomStudentProfile/HomeroomStudentProfile.js";
import {ParentLink} from "../screens/Parent/ParentLinks/ParentLink.js";
import {Settings} from "../screens/Settings/Settings.js";
import {APPLICATIONS, DASHBOARD, ENROLLMENT, HOMEROOM, PARENT_LINK, SETTINGS, USERS} from "../utils/constants.js";
export const Routes = () => {
  const {me} = useContext(UserContext);
  const {students} = me;
  const [isSuper, setIsSuper] = useState(null);
  return /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: DASHBOARD
  }, isSuper ? /* @__PURE__ */ React.createElement(AdminDashboard, null) : /* @__PURE__ */ React.createElement(Dashboard, null)), /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: `${HOMEROOM + ENROLLMENT}/:id`,
    children: ({match}) => {
      const currStudent = find(students, {student_id: match?.params.id});
      const packetAccepted = currStudent.packets?.length > 0 && currStudent.packets?.at(-1).status === "Accepted";
      const packetSubmitted = currStudent.packets?.length > 0 && currStudent.packets?.at(-1).status === "Submitted";
      if (currStudent === void 0) {
        return /* @__PURE__ */ React.createElement(Homeroom, null);
      } else {
        return currStudent.applications.length > 0 && currStudent.applications.at(-1).status === "Accepted" ? packetAccepted || packetSubmitted ? /* @__PURE__ */ React.createElement(Enrollment, {
          id: match?.params.id
        }) : /* @__PURE__ */ React.createElement(Enrollment, {
          id: match?.params.id
        }) : /* @__PURE__ */ React.createElement(Homeroom, null);
      }
    }
  }), /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: `${HOMEROOM}/:id`,
    children: ({match}) => {
      const currStudent = find(students, {student_id: match?.params.id});
      if (currStudent === void 0) {
        return /* @__PURE__ */ React.createElement(Homeroom, null);
      } else {
        return /* @__PURE__ */ React.createElement(HomeroomStudentProfile, null);
      }
    }
  }), /* @__PURE__ */ React.createElement(Route, {
    path: HOMEROOM
  }, /* @__PURE__ */ React.createElement(Homeroom, null)), /* @__PURE__ */ React.createElement(Route, {
    path: ENROLLMENT
  }, /* @__PURE__ */ React.createElement(AdminEnrollment, null)), /* @__PURE__ */ React.createElement(Route, {
    path: APPLICATIONS
  }, /* @__PURE__ */ React.createElement(Applications, null)), /* @__PURE__ */ React.createElement(Route, {
    path: USERS
  }, /* @__PURE__ */ React.createElement(Users, null)), /* @__PURE__ */ React.createElement(Route, {
    path: SETTINGS
  }, /* @__PURE__ */ React.createElement(Settings, null)), /* @__PURE__ */ React.createElement(Route, {
    path: PARENT_LINK
  }, /* @__PURE__ */ React.createElement(ParentLink, null)));
};
