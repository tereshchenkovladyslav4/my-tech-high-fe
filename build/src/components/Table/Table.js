import {TableCell, TableContainer, TableHead, TableRow, Table as MUITable, TableBody} from "../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import React, {useState} from "../../../_snowpack/pkg/react.js";
export const Table = ({tableHeaders, tableBody}) => {
  const [rows] = useState(tableBody);
  const renderTableHeaders = () => tableHeaders && /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, map(tableHeaders, (label, idx) => /* @__PURE__ */ React.createElement(TableCell, {
    sx: {paddingY: 0},
    key: `${label}-${idx}`
  }, label))));
  const renderTableBody = () => map(rows, (obj) => /* @__PURE__ */ React.createElement(TableRow, null, Object.values(obj).map((val, idx) => /* @__PURE__ */ React.createElement(TableCell, {
    sx: {paddingY: 0},
    key: `${val}-${idx}`
  }, val))));
  return /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(MUITable, null, renderTableHeaders(), /* @__PURE__ */ React.createElement(TableBody, null, renderTableBody())));
};
