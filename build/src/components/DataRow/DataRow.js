import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React from "../../../_snowpack/pkg/react.js";
export const DataRow = ({label, value, backgroundColor}) => /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  sx: {backgroundColor, marginX: 4, marginY: 2, paddingY: 2, paddingX: 2},
  alignItems: "center"
}, label, value);
