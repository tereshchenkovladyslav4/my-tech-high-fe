import {Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {useRouteMatch} from "../../../../_snowpack/pkg/react-router-dom.js";
const AdminSetting = () => {
  const {path, isExact} = useRouteMatch("/settings");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, isExact && /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 4,
    columnSpacing: 0,
    sx: {paddingX: 2, marginTop: 4}
  }));
};
export {AdminSetting as default};
