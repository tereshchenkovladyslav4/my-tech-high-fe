import {Box, Container} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
import {Title} from "../Typography/Title/Title.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
export const EmptyState = ({title, subtitle, image}) => /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center"
}, /* @__PURE__ */ React.createElement("img", {
  src: image
}), /* @__PURE__ */ React.createElement(Title, null, title), /* @__PURE__ */ React.createElement(Subtitle, null, subtitle)));
