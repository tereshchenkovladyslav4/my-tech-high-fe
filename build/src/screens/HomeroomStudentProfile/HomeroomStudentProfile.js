import {Tabs, Tab} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React from "../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../components/Typography/Paragraph/Paragraph.js";
import {MTHBLUE, SYSTEM_01} from "../../utils/constants.js";
import {Student} from "./Student/Student.js";
import {useStyles} from "./styles.js";
export const HomeroomStudentProfile = () => {
  const [value, setValue] = React.useState(0);
  const classes = useStyles;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabTextColor = (tab) => value === tab ? MTHBLUE : SYSTEM_01;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Tabs, {
    value,
    onChange: handleChange,
    "aria-label": "basic tabs example",
    centered: true,
    sx: classes.activeTab,
    TabIndicatorProps: {style: {background: "#4145FF"}}
  }, /* @__PURE__ */ React.createElement(Tab, {
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      color: tabTextColor(0)
    }, "Student"),
    sx: {textTransform: "none"}
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      color: tabTextColor(1)
    }, "Homeroom"),
    sx: {textTransform: "none", marginX: 12}
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      color: tabTextColor(2)
    }, "Resources"),
    sx: {textTransform: "none"}
  })), value === 0 ? /* @__PURE__ */ React.createElement(Student, null) : value === 1 ? /* @__PURE__ */ React.createElement("h1", null, " Coming Soon ") : /* @__PURE__ */ React.createElement("h1", null, " Coming Soon "));
};
