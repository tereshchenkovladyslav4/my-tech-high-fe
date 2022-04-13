import React from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const MinimumGrade = () => {
  const styles = useStyles();
  const {values: formikValues, handleChange, errors, touched} = useFormikContext();
  const values = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const parseValue = (value) => {
    if (value === "K")
      return "Kindergarten (5)";
    const numberValue = parseInt(value);
    if (numberValue === 1)
      return "1st grade (6)";
    if (numberValue === 2)
      return "2nd grade (7)";
    if (numberValue === 3)
      return "3rd grade (8)";
    return `${value}th grade (${value !== "12" ? numberValue + 5 : `${numberValue + 5}/${numberValue + 6}`})`;
  };
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
  }, "Minimum Grade"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    name: "min_grade_level",
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: formikValues.min_grade_level || "N/A",
    onChange: handleChange
  }, !formikValues.min_grade_level && /* @__PURE__ */ React.createElement(MenuItem, {
    key: -1,
    value: "N/A"
  }, "Select"), values.map((item, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    value: item
  }, parseValue(item))))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.min_grade_level && errors.min_grade_level));
};
export {MinimumGrade as default};
