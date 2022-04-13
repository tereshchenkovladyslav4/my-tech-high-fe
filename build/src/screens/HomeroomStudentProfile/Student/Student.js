import {Box, Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {ToDo} from "../../Dashboard/ToDoList/ToDo.js";
import {StudentProfile} from "./StudentProfile/StudentProfile.js";
import {StudentSchedule} from "./StudentSchedule/StudentSchedule.js";
export const Student = () => {
  const builderActive = false;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    padding: 4,
    rowSpacing: 4
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(StudentProfile, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, builderActive && /* @__PURE__ */ React.createElement(StudentSchedule, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(ToDo, null))));
};
