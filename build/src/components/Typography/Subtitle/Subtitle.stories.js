import React from "../../../../_snowpack/pkg/react.js";
import {Subtitle} from "./Subtitle.js";
export default {
  title: "Typography/Subtitle",
  component: Subtitle
};
export const LargeTitle = () => /* @__PURE__ */ React.createElement(Subtitle, {
  size: "large"
}, " This is a large Subtitle");
export const MediumTitle = () => /* @__PURE__ */ React.createElement(Subtitle, {
  size: "medium"
}, " This is a medium Subtitle");
export const SmallTitle = () => /* @__PURE__ */ React.createElement(Subtitle, null, " This is a small Subtitle");
