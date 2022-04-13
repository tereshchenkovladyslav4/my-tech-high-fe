import React, {useContext} from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {YearsContext} from "../../Immunizations.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const MaximumSchoolYear = () => {
  const styles = useStyles();
  const {values, handleChange, errors, touched} = useFormikContext();
  const schoolYears = useContext(YearsContext);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      padding: "5px",
      marginY: "10px",
      marginX: "33px",
      bgcolor: "white",
      height: "35px",
      borderRadius: "10px",
      textAlign: "center",
      width: "auto"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "span",
    sx: {width: "200px", textAlign: "left"}
  }, "Maximum School Year"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    name: "max_school_year_required",
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: values.max_school_year_required !== void 0 ? values.max_school_year_required : "N/A",
    onChange: handleChange
  }, values.max_school_year_required === void 0 && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "N/A"
  }, "Select"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: 0
  }, "No Maximum"), schoolYears.map((year) => {
    const date_begin = new Date(year.date_begin).getFullYear().toString();
    const date_end = new Date(year.date_end).getFullYear().toString();
    return /* @__PURE__ */ React.createElement(MenuItem, {
      key: year.school_year_id,
      value: parseInt(year.school_year_id)
    }, `${date_begin}-${date_end.substring(2, 4)}`);
  }))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.max_school_year_required && errors.max_school_year_required));
};
export {MaximumSchoolYear as default};
