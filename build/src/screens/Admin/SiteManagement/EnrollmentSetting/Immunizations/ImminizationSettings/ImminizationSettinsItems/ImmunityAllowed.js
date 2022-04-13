import React from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const ImmunityAllowed = () => {
  const styles = useStyles();
  const {values, handleChange, errors, touched} = useFormikContext();
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      padding: "5px",
      marginY: "10px",
      marginX: "33px",
      bgcolor: "#FAFAFA",
      height: "35px",
      borderRadius: "10px",
      textAlign: "center",
      width: "auto"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "span",
    sx: {width: "200px", textAlign: "left"}
  }, "Immunity Allowed"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    name: "immunity_allowed",
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: values.immunity_allowed !== void 0 ? values.immunity_allowed : "N/A",
    onChange: handleChange
  }, values.immunity_allowed === void 0 && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "N/A"
  }, "Select"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: 1
  }, "Yes"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: 0
  }, "No"))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.immunity_allowed && errors.immunity_allowed));
};
export {ImmunityAllowed as default};
