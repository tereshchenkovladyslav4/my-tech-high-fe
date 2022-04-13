import React from "../../../_snowpack/pkg/react.js";
import {DataRow} from "./DataRow.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import {Title} from "../Typography/Title/Title.js";
export default {
  title: "Components/DataRow",
  component: DataRow
};
export const Default = () => /* @__PURE__ */ React.createElement(DataRow, {
  backgroundColor: "red",
  label: /* @__PURE__ */ React.createElement(Title, null, "Left Label"),
  value: /* @__PURE__ */ React.createElement(Subtitle, null, "Right Value")
});
