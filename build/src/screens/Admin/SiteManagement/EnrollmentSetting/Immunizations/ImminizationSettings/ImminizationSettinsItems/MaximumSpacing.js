import React from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, TextField, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const MaximumSpacing = () => {
  const styles = useStyles();
  const localValues = ["NONE", "DAYS", "WEEKS", "MONTHS"];
  const {values, setFieldValue, handleChange, touched, errors} = useFormikContext();
  if (!values.consecutive_vaccine || values.consecutive_vaccine < 1)
    return null;
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
  }, "Maximum Spacing"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(TextField, {
    name: "max_spacing_interval",
    value: values.max_spacing_interval || "",
    onChange: handleChange,
    sx: {width: "50px"},
    inputProps: {
      style: {padding: 0},
      min: 1,
      inputMode: "numeric",
      pattern: "[1-9]*"
    },
    type: "number",
    disabled: values.max_spacing_date < 1
  })), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    name: "max_spacing_date",
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: values.max_spacing_date || 0,
    onChange: (e) => {
      if (!e.target.value)
        setFieldValue("max_spacing_interval", 0);
      handleChange(e);
    }
  }, localValues.map((item, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    value: index
  }, item)))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.max_spacing_interval && errors.max_spacing_interval));
};
export {MaximumSpacing as default};
