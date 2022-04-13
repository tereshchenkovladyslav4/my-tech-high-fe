import {Box, Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useState} from "../../../../_snowpack/pkg/react.js";
import {ApplicationTable} from "./ApplicationTable/ApplicationTable.js";
import {Filters} from "./Filters/Filters.js";
export const Applications = () => {
  const [filter, setFilter] = useState({});
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {marginX: 4}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Filters, {
    filter,
    setFilter
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(ApplicationTable, {
    filter
  }))));
};
