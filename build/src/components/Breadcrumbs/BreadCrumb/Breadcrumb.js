import {Box} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../Typography/Paragraph/Paragraph.js";
export const Breadcrumb = ({title, active, idx, handleClick}) => {
  const showBorder = active ? "#4145FF" : "#EEF4F8";
  return /* @__PURE__ */ React.createElement(Box, {
    style: {borderColor: showBorder, cursor: "pointer"},
    borderBottom: 4,
    display: "inline-block",
    paddingRight: 5,
    onClick: () => handleClick(idx)
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700"
  }, title));
};
