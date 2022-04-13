import {FormControl, Select, MenuItem, TextField, FormHelperText} from "../../../_snowpack/pkg/@mui/material.js";
import {Box, styled} from "../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import React, {useState} from "../../../_snowpack/pkg/react.js";
import {useStyles} from "./styles.js";
import {SYSTEM_05} from "../../utils/constants.js";
const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== "focusColor"
})((p) => ({
  "& .MuiInput-underline:after": {
    borderBottomColor: "#ccc",
    borderWidth: "1px"
  },
  "& .MuiFilledInput-underline:after": {
    borderBottomColor: "#ccc",
    borderWidth: "1px"
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#ccc",
      borderWidth: "1px"
    }
  }
}));
const Placeholder = ({children}) => {
  return /* @__PURE__ */ React.createElement("div", null, children);
};
export const DropDown = ({
  dropDownItems,
  placeholder,
  setParentValue,
  labelTop,
  alternate,
  disabled,
  size,
  defaultValue,
  sx,
  error,
  name,
  dropdownColor
}) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (val) => {
    setValue(val);
    setParentValue(val);
  };
  const renderDropDownItem = () => map(dropDownItems, (dropDownItem, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    value: dropDownItem.value
  }, dropDownItem.label));
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {minWidth: 120, ...sx}
  }, !labelTop ? /* @__PURE__ */ React.createElement(FormControl, {
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(Select, {
    labelId: "demo-simple-select-label",
    id: "demo-simple-select",
    value,
    onChange: (e) => handleChange(e.target?.value),
    displayEmpty: true,
    renderValue: `${value}` ? void 0 : () => /* @__PURE__ */ React.createElement(Placeholder, null, placeholder),
    sx: {...sx, borderRadius: 2, "& .MuiSelect-outlined": {
      background: dropdownColor
    }},
    size: size || "medium",
    error: error?.error,
    disabled: disabled || false
  }, renderDropDownItem()), /* @__PURE__ */ React.createElement(FormHelperText, {
    sx: {color: "#BD0043"}
  }, error?.errorMsg)) : /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(CssTextField, {
    name,
    size: size || "medium",
    focused: true,
    value: value || "",
    onChange: (e) => handleChange(e.target.value),
    InputLabelProps: {
      style: {color: alternate && SYSTEM_05}
    },
    select: true,
    label: placeholder,
    sx: alternate ? classes.alternate : classes.textfield,
    error: error?.error,
    helperText: error?.errorMsg
  }, renderDropDownItem())));
};
