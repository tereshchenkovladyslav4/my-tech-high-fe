import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React from "../../../_snowpack/pkg/react.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import {Breadcrumb} from "./BreadCrumb/Breadcrumb.js";
export const Breadcrumbs = ({
  steps,
  handleClick
}) => {
  const renderBreadcrumbs = () => map(steps, (step, idx) => /* @__PURE__ */ React.createElement(Breadcrumb, {
    idx,
    title: step.label,
    active: step.active,
    handleClick
  }));
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, renderBreadcrumbs());
};
