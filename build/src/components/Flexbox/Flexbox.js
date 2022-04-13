import React from "../../../_snowpack/pkg/react.js";
import Box from "../../../_snowpack/pkg/@mui/material/Box.js";
export const Flexbox = ({children, flexDirection, textAlign}) => /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  flex: 1,
  flexDirection,
  textAlign: textAlign || "center"
}, children);
