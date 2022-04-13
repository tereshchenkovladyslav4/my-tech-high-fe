import React from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "./Paragraph.js";
export default {
  title: "Typography/Paragraph",
  component: Paragraph
};
export const LargeParagraph = () => /* @__PURE__ */ React.createElement(Paragraph, {
  size: "large"
}, " Large Paragraph ");
export const MediumParagraph = () => /* @__PURE__ */ React.createElement(Paragraph, {
  size: "medium"
}, " medium Paragraph ");
export const SmallParagraph = () => /* @__PURE__ */ React.createElement(Paragraph, {
  size: "small"
}, " small Paragraph ");
