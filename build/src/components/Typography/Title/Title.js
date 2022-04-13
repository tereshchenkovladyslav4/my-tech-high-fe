import {Typography} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
export const Title = ({sx, fontWeight: fontWeight2, children, size, color, textAlign}) => {
  const fontSize = () => size === "large" ? 32 : size === "medium" ? 28 : 24;
  return /* @__PURE__ */ React.createElement(Typography, {
    fontWeight: fontWeight2 || "bold",
    fontSize,
    color,
    textAlign,
    sx
  }, children);
};
