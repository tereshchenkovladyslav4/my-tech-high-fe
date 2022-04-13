import {Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {APPLICATIONS, ENROLLMENT_PACKETS} from "../../../utils/constants.js";
import {AdminEnrollmentCard} from "./components/AdminEnrollmentCard/AdminEnrollmentCard.js";
import applicationsImg from "../../../assets/applications.png.proxy.js";
import enrollmentImg from "../../../assets/enrollment.png.proxy.js";
import schedules from "../../../assets/schedules.png.proxy.js";
import schoolAssignmentsImg from "../../../assets/schoolAssignments.png.proxy.js";
import testingPreferencesImg from "../../../assets/testingPreferences.png.proxy.js";
import withdrawlsImg from "../../../assets/withdrawls.png.proxy.js";
export default function Enrollment() {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 4,
    columnSpacing: 0,
    sx: {paddingX: 2, marginTop: 4}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AdminEnrollmentCard, {
    title: "Applications",
    link: APPLICATIONS,
    img: applicationsImg
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AdminEnrollmentCard, {
    title: "Packets",
    link: ENROLLMENT_PACKETS,
    img: enrollmentImg
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AdminEnrollmentCard, {
    title: "Schedules",
    link: "https://google.com",
    img: schedules
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AdminEnrollmentCard, {
    title: "School Assignments",
    link: "https://google.com",
    img: schoolAssignmentsImg
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AdminEnrollmentCard, {
    title: "Withdrawls",
    link: "https://google.com",
    img: withdrawlsImg
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AdminEnrollmentCard, {
    title: "Testing Preference",
    link: "https://google.com",
    img: testingPreferencesImg
  })));
}
