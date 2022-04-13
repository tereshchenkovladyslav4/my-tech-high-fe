import styled from "../../../_snowpack/pkg/@emotion/styled.js";
import {TextField as MuiTextField} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
const CssTextField = styled(MuiTextField)({
  "& label.Mui-focused": {
    color: "#1a1a1a",
    background: "#ffffffc2"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1a1a1a36",
    borderRadius: 4
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 4,
    "& fieldset": {
      borderColor: "#1a1a1a36"
    },
    "&:hover fieldset": {
      borderColor: "#0000003b",
      borderRadius: 4
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1a1a1a69",
      borderRadius: 4
    }
  }
});
const TextField = ({value, onChange, label, size, variant, fullWidth, sx, style, placeholder}) => {
  return /* @__PURE__ */ React.createElement(CssTextField, {
    label,
    placeholder,
    size: size || "small",
    variant: variant || "outlined",
    fullWidth: fullWidth || true,
    value,
    onChange: (e) => onChange(e.target.value),
    inputProps: {
      style
    },
    sx
  });
};
export {TextField as default};
