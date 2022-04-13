import {Container, CircularProgress, Box} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
export const LoadingScreen = () => /* @__PURE__ */ React.createElement(Container, {
  sx: {height: "100vh"}
}, /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  flex: 1,
  height: "100%",
  alignItems: "center"
}, /* @__PURE__ */ React.createElement(CircularProgress, null)));
