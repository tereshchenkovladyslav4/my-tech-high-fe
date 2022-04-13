import {Typography} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
export const Paragraph = ({children, size, color, fontWeight, fontFamily, textAlign, sx, onClick}) => {
  const fontSize = () => size === "large" ? 14 : size === "medium" ? 12 : 10;
  return /* @__PURE__ */ React.createElement(Typography, {
    fontWeight,
    color,
    fontSize,
    fontFamily,
    textAlign,
    sx,
    onClick
  }, children);
};
