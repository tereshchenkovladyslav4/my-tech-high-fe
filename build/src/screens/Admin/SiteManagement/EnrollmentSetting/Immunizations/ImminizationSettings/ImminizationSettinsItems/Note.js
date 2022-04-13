import React, {useState} from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, Typography, Divider, TextField, Button, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./style.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const MinimumGrade = () => {
  const styles = useStyles();
  const {values, handleChange, errors, touched} = useFormikContext();
  const [focused, setFocused] = useState(false);
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
      width: "93%"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "span",
    sx: {marginRight: "110px", textAlign: "left"}
  }, "Note/Tooltip"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    sx: {width: focused ? "80%" : void 0},
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, !focused ? values.tooltip === "" ? /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setFocused(true),
    sx: {color: "#4145FF", padding: 0, marginLeft: "-11px", fontSize: "16px"}
  }, "Select") : /* @__PURE__ */ React.createElement(Typography, {
    onClick: () => setFocused(true)
  }, values.tooltip || "") : /* @__PURE__ */ React.createElement(TextField, {
    name: "tooltip",
    value: values.tooltip || "",
    onChange: handleChange,
    id: "standard-basic",
    variant: "standard",
    InputProps: {
      disableUnderline: true
    },
    fullWidth: true
  })), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.tooltip && errors.tooltip));
};
export {MinimumGrade as default};
