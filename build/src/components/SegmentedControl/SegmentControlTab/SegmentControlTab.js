import {Tab} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
export const LinkTab = (props) => /* @__PURE__ */ React.createElement(Tab, {
  component: "a",
  onClick: (event) => {
    event.preventDefault();
  },
  ...props,
  style: {color: "#CCCCCC"}
});
