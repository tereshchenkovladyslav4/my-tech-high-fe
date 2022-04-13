import {Box, Button, Card, Divider, Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {CalendarComponent} from "./components/CalendarComponent.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
import {MTHGREEN, SYSTEM_01, SYSTEM_05, SYSTEM_02} from "../../../utils/constants.js";
export const Calendar = () => {
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(Card, {
    style: {borderRadius: 12}
  }, /* @__PURE__ */ React.createElement(Box, {
    flexDirection: "column",
    textAlign: "left",
    paddingY: 3,
    paddingX: 3,
    display: "flex"
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "bold"
  }, "Calendar"), /* @__PURE__ */ React.createElement(Button, {
    sx: {mt: 1.5, background: "#2b9db72b", width: 72}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    color: MTHGREEN,
    size: 12,
    fontWeight: "500"
  }, "Event")), /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    fontWeight: "500",
    sx: {my: 1.5},
    color: SYSTEM_02
  }, "Highlighting our new MTH Game Maker course!"), /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    fontWeight: "bold",
    color: SYSTEM_01,
    sx: {display: "inline-block"}
  }, "September 12, 2:11 PM"), /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    fontWeight: "500",
    color: SYSTEM_05,
    sx: {mt: 2}
  }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(Divider, {
    orientation: "vertical",
    style: classes.divider
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(CalendarComponent, null)))));
};
