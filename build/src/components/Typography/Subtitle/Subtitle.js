import {Typography} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
export const Subtitle = ({
  textAlign,
  children,
  size,
  color,
  fontWeight,
  sx,
  onClick,
  className
}) => {
  const fontSize = () => size === "large" ? 20 : size === "medium" ? 18 : 16;
  return /* @__PURE__ */ React.createElement(Typography, {
    textAlign,
    sx,
    fontWeight,
    color,
    fontSize,
    onClick,
    className
  }, children);
};
