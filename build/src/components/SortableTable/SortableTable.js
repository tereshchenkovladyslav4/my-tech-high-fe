import {TableContainer, Table, TableBody, TableRow, TableCell, Checkbox} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {SortableTableHeader} from "./SortableTableHeader/SortableTableHeader.js";
export const SortableTable = ({headCells, rows, onCheck, clearAll, onRowClick}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    onCheck(selected);
  }, [selected]);
  useEffect(() => {
    setSelected([]);
  }, [clearAll]);
  function descendingComparator(a, b, orderBy2) {
    if (orderBy2 === "grade") {
      const agrade = a[orderBy2] || "";
      const bgrade = b[orderBy2] || "";
      if (Number(bgrade.replace(/\D/g, "")) < Number(agrade.replace(/\D/g, ""))) {
        return -1;
      }
      if (Number(bgrade.replace(/\D/g, "")) > Number(agrade.replace(/\D/g, ""))) {
        return 1;
      }
      return 0;
    } else if (orderBy2 === "emailed") {
      return a[orderBy2] === b[orderBy2] ? 0 : a[orderBy2] ? -1 : 1;
    } else {
      if (b[orderBy2] < a[orderBy2]) {
        return -1;
      }
      if (b[orderBy2] > a[orderBy2]) {
        return 1;
      }
      return 0;
    }
  }
  function getComparator(order2, orderBy2) {
    return order2 === "desc" ? (a, b) => descendingComparator(a, b, orderBy2) : (a, b) => -descendingComparator(a, b, orderBy2);
  }
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order2 = comparator(a[0], b[0]);
      if (order2 !== 0) {
        return order2;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, idx) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const classes = event.target.getAttribute("class");
    if (classes && classes.includes("delete-row")) {
      return false;
    }
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const getColor = (key, value) => {
    switch (key) {
      case "studentStatus":
        if (value === "New") {
          return "#00C12B";
        } else {
          return "#4145FF";
        }
      case "emailed":
        return "#4145FF";
    }
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "100%"}
  }, /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, {
    sx: {minWidth: 750},
    "aria-labelledby": "tableTitle",
    size: "small"
  }, /* @__PURE__ */ React.createElement(SortableTableHeader, {
    numSelected: selected.length,
    order,
    orderBy: orderBy.toString(),
    onSelectAllClick: handleSelectAllClick,
    onRequestSort: handleRequestSort,
    rowCount: rows.length,
    headCells
  }), /* @__PURE__ */ React.createElement(TableBody, null, stableSort(rows, getComparator(order, orderBy)).map((row) => {
    const isItemSelected = isSelected(row.id.toString());
    const labelId = `enhanced-table-checkbox-${row.id}`;
    return /* @__PURE__ */ React.createElement(TableRow, {
      hover: true,
      role: "checkbox",
      "aria-checked": isItemSelected,
      tabIndex: -1,
      key: row.id,
      selected: isItemSelected
    }, /* @__PURE__ */ React.createElement(TableCell, {
      padding: "checkbox",
      onClick: (event) => {
        handleClick(event, row.id);
      }
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      color: "primary",
      checked: isItemSelected,
      inputProps: {
        "aria-labelledby": labelId
      }
    })), Object.keys(row).map((key, idx) => {
      return key === "student" ? /* @__PURE__ */ React.createElement(TableCell, {
        key: idx,
        sx: {
          paddichngY: 1,
          paddingLeft: 0,
          textAlign: idx !== 0 && "left",
          fontWeight: "700",
          cursor: "pointer"
        },
        onClick: (e) => {
          e.stopPropagation();
          onRowClick && onRowClick(row.id);
        }
      }, row[key] || "") : key !== "id" && /* @__PURE__ */ React.createElement(TableCell, {
        key: idx,
        sx: {
          paddingY: 1,
          paddingLeft: 0,
          textAlign: idx !== 0 && "left",
          fontWeight: "700",
          cursor: "pointer",
          color: getColor(key, row[key])
        }
      }, row[key] || "");
    }));
  })))));
};
