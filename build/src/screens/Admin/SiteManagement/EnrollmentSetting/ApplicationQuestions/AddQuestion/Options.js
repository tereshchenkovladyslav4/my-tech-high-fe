import React from "../../../../../../../_snowpack/pkg/react.js";
import {Box, Radio, TextField, Checkbox, IconButton} from "../../../../../../../_snowpack/pkg/@mui/material.js";
import {SYSTEM_07} from "../../../../../../utils/constants.js";
import CloseSharp from "../../../../../../../_snowpack/pkg/@mui/icons-material/CloseSharp.js";
export default function QuestionOptions({
  options,
  setOptions,
  type
}) {
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "80%"
  }, options.map((opt, i) => /* @__PURE__ */ React.createElement(Box, {
    key: opt.value,
    sx: {
      display: "flex",
      py: "10px",
      opacity: opt.label.trim() || i === 0 ? 1 : 0.3
    }
  }, type === 3 ? /* @__PURE__ */ React.createElement(Checkbox, null) : type === 5 ? /* @__PURE__ */ React.createElement(Radio, null) : null, /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    sx: {
      flex: 1,
      pl: "10px",
      "& .MuiInput-underline:after": {
        borderWidth: "1px",
        borderColor: SYSTEM_07
      }
    },
    placeholder: "Add Option",
    variant: "standard",
    value: opt.label,
    focused: true,
    onChange: (e) => {
      const val = e.currentTarget.value;
      const newOps = options.map((o) => o.value === opt.value ? {...o, label: val} : o);
      if (i === options.length - 1) {
        setOptions([...newOps, {value: options.length + 1, label: ""}]);
      } else {
        setOptions(newOps);
      }
    }
  }), opt.label.trim() || i === 0 ? /* @__PURE__ */ React.createElement(IconButton, {
    sx: {
      color: "#fff",
      bgcolor: "#000",
      width: "30px",
      height: "30px",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px"
    },
    onClick: () => {
      setOptions(options.filter((o) => o.value !== opt.value).map((v, i2) => ({value: i2, label: v.label.trim()})));
    }
  }, /* @__PURE__ */ React.createElement(CloseSharp, null)) : /* @__PURE__ */ React.createElement(Box, {
    width: "40px"
  }))));
}
