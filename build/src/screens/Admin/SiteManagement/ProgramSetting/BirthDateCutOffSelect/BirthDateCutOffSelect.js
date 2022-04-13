import React from "../../../../../../_snowpack/pkg/react.js";
import ReactInputDateMask from "../../../../../../_snowpack/pkg/react-input-date-mask.js";
import {Box, Typography, Stack} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {makeStyles} from "../../../../../../_snowpack/pkg/@material-ui/core.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
const useStyles = makeStyles({
  DateMask: {
    font: "inherit",
    letterSpacing: "inherit",
    color: "currentColor",
    border: 0,
    boxSizing: "content-box",
    background: "none",
    height: "1.4375em",
    margin: 0,
    display: "block",
    minWidth: 0,
    animationName: "mui-auto-fill-cancel",
    animationDuration: "10ms",
    padding: "16.5px 14px"
  },
  DateMaskInvalid: {
    border: "1px solid red",
    borderRadius: "5px"
  }
});
export default function BirthDateCutOffSelect({birthDate, invalid, setBirthDate, setIsChanged}) {
  const handleChange = (value) => {
    setBirthDate(value);
    setIsChanged(true);
  };
  const classes = useStyles();
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
  }, "Birth Date Cut-off"), /* @__PURE__ */ React.createElement(Typography, null, "|"), /* @__PURE__ */ React.createElement(Box, {
    component: "form",
    sx: {
      "& > :not(style)": {m: 1, minWidth: "150"}
    },
    noValidate: true,
    autoComplete: "off"
  }, /* @__PURE__ */ React.createElement(ReactInputDateMask, {
    className: `${classes.DateMask} ${invalid ? classes.DateMaskInvalid : ""}`,
    mask: "mm/dd/yyyy",
    showMaskOnFocus: true,
    value: birthDate,
    onChange: handleChange,
    showMaskOnHover: true
  })));
}
