import {Grid} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
import {ToDo} from "../Dashboard/ToDoList/ToDo.js";
import {Students} from "./Students/Students.js";
export const Homeroom = () => /* @__PURE__ */ React.createElement(Grid, {
  container: true,
  padding: 4,
  rowSpacing: 4
}, /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  xs: 12
}, /* @__PURE__ */ React.createElement(Students, null)), /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  xs: 12
}, /* @__PURE__ */ React.createElement(ToDo, null)));
