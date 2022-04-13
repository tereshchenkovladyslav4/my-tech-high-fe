import {Divider, ListItem, ListItemText} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
export const Metadata = ({
  image,
  title,
  subtitle,
  secondaryAction,
  verticle,
  disableGutters,
  divider
}) => !verticle ? /* @__PURE__ */ React.createElement(ListItem, {
  secondaryAction,
  disableGutters
}, divider && /* @__PURE__ */ React.createElement(Divider, {
  sx: {
    background: "black",
    height: 35,
    marginX: 3
  },
  variant: "middle",
  orientation: "vertical"
}), image && image, /* @__PURE__ */ React.createElement(ListItemText, {
  primary: title,
  secondary: subtitle
})) : /* @__PURE__ */ React.createElement(Box, {
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center",
  display: "flex"
}, image && image, /* @__PURE__ */ React.createElement(ListItemText, {
  primary: title,
  secondary: subtitle
}));
