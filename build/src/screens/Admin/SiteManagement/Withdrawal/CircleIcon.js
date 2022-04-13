import {Box} from "../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../_snowpack/pkg/react.js";
import MainImage from "../../../../assets/icons/circle-icon/main.png.proxy.js";
import DotImage from "../../../../assets/icons/circle-icon/dot.png.proxy.js";
import Ellipse from "../../../../assets/icons/circle-icon/ellipse.png.proxy.js";
import EllipseBottom from "../../../../assets/icons/circle-icon/ellipse-bottom.png.proxy.js";
const CircleIcon = () => {
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {position: "relative"}
  }, /* @__PURE__ */ React.createElement("img", {
    src: MainImage,
    style: {position: "relative"}
  }), /* @__PURE__ */ React.createElement("img", {
    src: Ellipse,
    style: {position: "absolute", top: "49%", left: "0%", width: "100%"}
  }), /* @__PURE__ */ React.createElement("img", {
    src: EllipseBottom,
    style: {position: "absolute", top: "279px", right: "0%"}
  }), /* @__PURE__ */ React.createElement("img", {
    src: DotImage,
    style: {position: "absolute", top: "45%", left: "50%"}
  }), /* @__PURE__ */ React.createElement("img", {
    src: DotImage,
    style: {position: "absolute", top: "48%", left: "53.4%"}
  }), /* @__PURE__ */ React.createElement("img", {
    src: DotImage,
    style: {position: "absolute", top: "50%", left: "54.5%"}
  }));
};
export {CircleIcon as default};
