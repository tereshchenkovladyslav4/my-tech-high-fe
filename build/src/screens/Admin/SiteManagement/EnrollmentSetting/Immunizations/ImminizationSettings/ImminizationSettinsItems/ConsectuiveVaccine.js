import React, {useContext, useState} from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {DataContext} from "../../Immunizations.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
const ConsecutiveVaccine = () => {
  const {values, setFieldValue, handleChange, errors, touched} = useFormikContext();
  const [consecutiveVaccine, setConsecutiveVaccine] = useState(typeof values.consecutive_vaccine === "undefined" ? "Select" : values.consecutive_vaccine ? "Yes" : "No");
  const styles = useStyles();
  const handleLocalChange = (event) => {
    const val = event.target.value;
    setConsecutiveVaccine(val);
    if (val === "No") {
      setFieldValue("consecutive_vaccine", 0);
    } else if (val === "Yes") {
      setFieldValue("consecutive_vaccine", -1);
    }
  };
  const localValues = ["Yes", "No"];
  const data = useContext(DataContext);
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
    sx: {
      width: "200px",
      textAlign: "left"
    }
  }, "Consecutive Vaccine"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: consecutiveVaccine,
    onChange: handleLocalChange
  }, consecutiveVaccine === "Select" && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "Select"
  }, "Select"), localValues.map((item, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    value: item
  }, item)))), consecutiveVaccine === "Yes" && /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    name: "consecutive_vaccine",
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: values.consecutive_vaccine || 0,
    onChange: handleChange
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: -1
  }, "-- Select Immunization --"), data.filter((v) => v.is_enabled && values.id !== v.id).sort((a, b) => {
    return a.order - b.order;
  }).map((item, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    value: Number(item.id)
  }, item.title)))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.consecutive_vaccine && errors.consecutive_vaccine));
};
export {ConsecutiveVaccine as default};
