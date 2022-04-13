import {Stack, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../../../../_snowpack/pkg/lodash.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE} from "../../../../../utils/constants.js";
const YearNode = ({title, data}) => {
  return /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center",
    sx: {my: 2}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 16,
    fontWeight: "600",
    textAlign: "left",
    sx: {minWidth: 180}
  }, title), /* @__PURE__ */ React.createElement(Typography, null, "|"), /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    sx: {ml: 1.5},
    alignItems: "center"
  }, map(data, (d) => /* @__PURE__ */ React.createElement(Subtitle, {
    color: d === "Select" ? MTHBLUE : "#000",
    size: 16,
    fontWeight: "600",
    textAlign: "left",
    sx: {mx: 1.2, minWidth: d === " " ? 60 : "auto"}
  }, d))));
};
export {YearNode as default};
