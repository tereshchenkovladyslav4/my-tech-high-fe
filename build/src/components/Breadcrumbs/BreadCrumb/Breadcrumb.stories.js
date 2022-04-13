import React from "../../../../_snowpack/pkg/react.js";
import {Breadcrumb} from "./Breadcrumb.js";
export default {
  title: "Components/Breadcrumbs/Breadcrumb",
  component: Breadcrumb
};
export const Default = () => /* @__PURE__ */ React.createElement(Breadcrumb, {
  title: "Contacts"
});
export const ActiveBreadcrumb = () => /* @__PURE__ */ React.createElement(Breadcrumb, {
  title: "Documents",
  active: true
});
