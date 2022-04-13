import {Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../_snowpack/pkg/@mui/system.js";
import React from "../../../../_snowpack/pkg/react.js";
import {EnrollmentPacketTable} from "./EnrollmentPacketTable/EnrollmentPacketTable.js";
export const EnrollmentPackets = () => {
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {marginX: 4}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(EnrollmentPacketTable, null))));
};
