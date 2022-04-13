import React from "../../../../../../_snowpack/pkg/react.js";
import {Box, Stack, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import Select from "../../../../../../_snowpack/pkg/@mui/material/Select.js";
import MenuItem from "../../../../../../_snowpack/pkg/@mui/material/MenuItem.js";
import FormControl from "../../../../../../_snowpack/pkg/@mui/material/FormControl.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
export default function ProgramSelect({program, setProgram, setIsChanged}) {
  const handleChange = (event) => {
    setProgram(event.target.value);
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
  }, "Program"), /* @__PURE__ */ React.createElement(Typography, null, "|"), /* @__PURE__ */ React.createElement(Box, {
    component: "form",
    sx: {
      "& > :not(style)": {m: 1, minWidth: "150"}
    },
    noValidate: true,
    autoComplete: "off"
  }, /* @__PURE__ */ React.createElement(FormControl, {
    variant: "standard",
    sx: {m: 1, minWidth: 200}
  }, /* @__PURE__ */ React.createElement(Select, {
    labelId: "demo-simple-select-standard-label",
    id: "demo-simple-select-standard",
    value: program ? program : "",
    onChange: handleChange,
    label: "Program"
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: ""
  }, /* @__PURE__ */ React.createElement("em", null, "None")), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "MTH"
  }, "MTH"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "TTA"
  }, "TTA")))));
}
