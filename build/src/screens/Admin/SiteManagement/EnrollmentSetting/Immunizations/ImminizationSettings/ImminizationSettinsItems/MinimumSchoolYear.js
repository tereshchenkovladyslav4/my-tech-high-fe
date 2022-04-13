import React, {useContext} from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {YearsContext} from "../../Immunizations.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const MinimumGrade = () => {
  const styles = useStyles();
  const {values, handleChange, touched, errors} = useFormikContext();
  const schoolYears = useContext(YearsContext);
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
    sx: {minWidth: "200px"}
  }, "Minimum School Year"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    labelId: "lbb",
    name: "min_school_year_required",
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: values.min_school_year_required !== void 0 ? values.min_school_year_required : "N/A",
    onChange: handleChange
  }, values.min_school_year_required === void 0 && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "N/A"
  }, "Select"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: 0
  }, "No Minimum"), schoolYears.map((year) => {
    const date_begin = new Date(year.date_begin).getFullYear().toString();
    const date_end = new Date(year.date_end).getFullYear().toString();
    return /* @__PURE__ */ React.createElement(MenuItem, {
      key: year.school_year_id,
      value: parseInt(year.school_year_id)
    }, `${date_begin}-${date_end.substring(2, 4)}`);
  }))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.min_school_year_required && errors.min_school_year_required));
};
export {MinimumGrade as default};
