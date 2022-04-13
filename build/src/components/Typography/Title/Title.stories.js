import React from "../../../../_snowpack/pkg/react.js";
import {Title} from "./Title.js";
export default {
  title: "Typography/Title",
  component: Title
};
export const LargeTitle = () => /* @__PURE__ */ React.createElement(Title, {
  size: "large"
}, " This is a large title");
export const MediumTitle = () => /* @__PURE__ */ React.createElement(Title, {
  size: "medium"
}, "This is a medium title ");
export const SmallTitle = () => /* @__PURE__ */ React.createElement(Title, {
  size: "small"
}, " This is a small title");
