import React from "../../../../../../_snowpack/pkg/react.js";
import {Box, TextField, Typography, Stack} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
export default function StateSelect({stateName, setStateName, setIsChanged}) {
  const handleChange = (event) => {
    setStateName(event.target.value);
    setIsChanged(true);
  };
  return /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center",
    sx: {my: 2}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 16,
    fontWeight: "600",
    textAlign: "left",
    sx: {minWidth: 150}
  }, "State"), /* @__PURE__ */ React.createElement(Typography, null, "|"), /* @__PURE__ */ React.createElement(Box, {
    component: "form",
    sx: {
      "& > :not(style)": {m: 1, minWidth: "150"}
    },
    noValidate: true,
    autoComplete: "off"
  }, /* @__PURE__ */ React.createElement(TextField, {
    id: "outlined-name",
    value: stateName,
    onChange: handleChange
  })));
}
