import {Box, Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {Title} from "../../../components/Typography/Title/Title.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../utils/constants.js";
export const Contact = () => /* @__PURE__ */ React.createElement(Box, {
  sx: {background: BUTTON_LINEAR_GRADIENT, paddingY: 10, paddingX: 12}
}, /* @__PURE__ */ React.createElement(Grid, {
  container: true
}, /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  xs: 6
}, /* @__PURE__ */ React.createElement(Title, {
  size: "large",
  color: "white"
}, "Contact us"), /* @__PURE__ */ React.createElement(Subtitle, {
  color: "white"
}, "If you have questions, please reach out!")), /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  xs: 6,
  alignItems: "center",
  display: "flex",
  justifyContent: "center"
}, /* @__PURE__ */ React.createElement(Box, {
  sx: {border: "solid 1px white", padding: 2, borderRadius: 10, width: "50%"}
}, /* @__PURE__ */ React.createElement(Paragraph, {
  color: "white"
}, "help@mytechhigh.com")))));
