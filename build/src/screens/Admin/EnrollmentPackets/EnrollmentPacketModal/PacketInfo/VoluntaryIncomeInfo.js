import React from "../../../../../../_snowpack/pkg/react.js";
import {Grid, TextField} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function VoluntaryIncomeInfo() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "700"
  }, "Voluntary Income Information"), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    columnSpacing: 4,
    rowSpacing: 2,
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Household Size"), /* @__PURE__ */ React.createElement(Controller, {
    name: "household_size",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Household Size",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Household Gross Monthly Income"), /* @__PURE__ */ React.createElement(Controller, {
    name: "household_income",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Household Gross Monthly Income",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  })))));
}
