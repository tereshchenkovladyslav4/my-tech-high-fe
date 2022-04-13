import React, {useState} from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText, ListItemText, Checkbox, IconButton, Button} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {useStyles} from "./style.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
import {getValidGrade} from "../../../../../EnrollmentPackets/EnrollmentPacketModal/helpers.js";
import CloseSharp from "../../../../../../../../_snowpack/pkg/@mui/icons-material/CloseSharp.js";
const RequireUpdate = () => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const {values, setFieldValue, handleChange, touched, errors} = useFormikContext();
  const [levelExtempUpdateValue, setLevelExtempUpdateValue] = useState(values.level_exempt_update);
  function getAvailableGrades() {
    const all = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const max = values.max_grade_level ? getValidGrade(values.max_grade_level) : -2;
    const min = values.min_grade_level ? getValidGrade(values.min_grade_level) : -2;
    return all.filter((v) => getValidGrade(v) <= max && getValidGrade(v) >= min);
  }
  const levelExempt = () => {
    try {
      let val = levelExtempUpdateValue || [];
      val = typeof val === "string" ? JSON.parse(val) : val;
      if (!(val instanceof Array))
        val = [];
      const all = getAvailableGrades();
      val = val.filter((v) => all.includes(v));
      return val;
    } catch (e) {
      return [];
    }
  };
  const parseGrade = (value) => {
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
      bgcolor: "white",
      height: "35px",
      borderRadius: "10px",
      width: "auto"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "span",
    sx: {width: "200px", textAlign: "left"}
  }, "Require Update if Exempt"), /* @__PURE__ */ React.createElement(Divider, {
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
    value: values.exempt_update !== void 0 ? values.exempt_update : "N/A",
    name: "exempt_update",
    onChange: handleChange
  }, typeof values.exempt_update === "undefined" && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "N/A"
  }, "Select"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: 1
  }, "Yes"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: 0
  }, "No"))), values.exempt_update === 1 && /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot},
    disabled: !getAvailableGrades().length
  }, /* @__PURE__ */ React.createElement(Select, {
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    value: levelExempt(),
    onChange: (e) => {
      setLevelExtempUpdateValue(e.target.value);
    },
    multiple: true,
    inputProps: {"aria-label": "Select Grade"},
    displayEmpty: true,
    onOpen: () => {
      setOpen(true);
    },
    open,
    renderValue: () => {
      let array = values.level_exempt_update || [];
      array = typeof array === "string" ? array.split(":").length === 1 ? JSON.parse(array) : [] : array;
      if (!(array instanceof Array))
        array = [];
      if (array instanceof Array && array.length > 0) {
        const sortArray = array.map((item) => {
          return {
            value: item,
            index: getAvailableGrades().indexOf(item)
          };
        });
        return sortArray.sort((a, b) => {
          return a.index - b.index;
        }).map((e) => e.value).join(", ");
      }
      return "-- Select Grade --";
    }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(IconButton, {
    sx: {
      color: "#fff",
      bgcolor: "#000",
      width: "30px",
      height: "30px",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "6px",
      left: "80%"
    },
    onClick: () => {
      setOpen(false);
      setLevelExtempUpdateValue(JSON.parse(values.level_exempt_update));
    }
  }, /* @__PURE__ */ React.createElement(CloseSharp, null))), getAvailableGrades().map((g) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: g,
    value: g
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    checked: levelExtempUpdateValue?.indexOf(g) > -1
  }), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: parseGrade(g)
  }))), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      padding: "6px 16px"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: {
      background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF",
      color: "white",
      width: "90px",
      height: "25px",
      marginLeft: "10px",
      "&:hover": {
        backgroundColor: "#4145FF"
      },
      borderRadius: "8px"
    },
    onClick: () => {
      setOpen(false);
      setFieldValue("level_exempt_update", JSON.stringify(levelExtempUpdateValue));
    }
  }, "Save")))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.exempt_update && errors.exempt_update || values.exempt_update === 1 && touched.level_exempt_update && errors.level_exempt_update));
};
export {RequireUpdate as default};
