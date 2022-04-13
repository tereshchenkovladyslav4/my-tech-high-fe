import {TableHead, TableRow, TableCell, Checkbox, TableSortLabel} from "../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../_snowpack/pkg/@mui/system.js";
import React from "../../../../_snowpack/pkg/react.js";
import {visuallyHidden} from "../../../../_snowpack/pkg/@mui/utils.js";
import {ArrowDropDown} from "../../../../_snowpack/pkg/@mui/icons-material.js";
export const SortableTableHeader = ({
  numSelected,
  onRequestSort,
  onSelectAllClick,
  order,
  orderBy,
  rowCount,
  headCells,
  noCheckbox
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, !noCheckbox && /* @__PURE__ */ React.createElement(TableCell, {
    padding: "checkbox"
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    color: "primary",
    indeterminate: numSelected > 0 && numSelected < rowCount,
    checked: rowCount > 0 && numSelected === rowCount,
    onChange: onSelectAllClick
  })), headCells.map((headCell, idx) => /* @__PURE__ */ React.createElement(TableCell, {
    sx: {fontWeight: 700},
    key: headCell.id,
    align: headCell.numeric ? "right" : "left",
    padding: headCell.disablePadding ? "none" : "normal",
    sortDirection: orderBy === headCell.id ? order : false
  }, idx !== headCells.length && /* @__PURE__ */ React.createElement(TableSortLabel, {
    active: true,
    direction: orderBy === headCell.id ? order : "asc",
    onClick: createSortHandler(headCell.id),
    IconComponent: ArrowDropDown
  }, headCell.label, orderBy === headCell.id ? /* @__PURE__ */ React.createElement(Box, {
    component: "span",
    sx: visuallyHidden
  }, order === "desc" ? "sorted descending" : "sorted ascending") : null)))));
};
