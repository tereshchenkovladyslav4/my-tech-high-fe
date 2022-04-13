import {Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useState, useContext} from "../../../_snowpack/pkg/react.js";
import {DropDown} from "../DropDown/DropDown.js";
import {SortableTableHeader} from "./SortableTableHeader/SortableTableHeader.js";
import {UpdateUserModal} from "../../screens/Admin/Users/UpdateUserModal/UpdateUserModal.js";
import {UserContext} from "../../providers/UserContext/UserProvider.js";
export const SortableUserTable = ({
  headCells,
  type,
  rows,
  onCheck,
  updateStatus,
  clearAll
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const {me} = useContext(UserContext);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [status, _] = useState([
    {
      value: 0,
      label: "Inactive"
    },
    {
      value: 1,
      label: "Active"
    },
    {
      value: 2,
      label: "Archived"
    }
  ]);
  useEffect(() => {
    onCheck(selected);
  }, [selected]);
  useEffect(() => {
    setSelected([]);
  }, [clearAll]);
  function descendingComparator(a, b, orderBy2) {
    if (b[orderBy2] < a[orderBy2]) {
      return -1;
    }
    if (b[orderBy2] > a[orderBy2]) {
      return 1;
    }
    return 0;
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
      const newSelecteds = rows.map((n, idx) => idx);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "100%", padding: 3}
  }, currentUserID && updateModal && /* @__PURE__ */ React.createElement(UpdateUserModal, {
    visible: updateModal,
    userID: currentUserID,
    handleModem: () => setUpdateModal(false)
  }), /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, {
    sx: {minWidth: 750},
    "aria-labelledby": "tableTitle",
    size: "medium"
  }, /* @__PURE__ */ React.createElement(SortableTableHeader, {
    numSelected: selected.length,
    order,
    orderBy,
    onSelectAllClick: handleSelectAllClick,
    onRequestSort: handleRequestSort,
    rowCount: rows.length,
    headCells,
    noCheckbox: true
  }), /* @__PURE__ */ React.createElement(TableBody, null, stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
    return /* @__PURE__ */ React.createElement(TableRow, {
      hover: true,
      onClick: (event) => {
      },
      tabIndex: -1,
      key: index,
      sx: {cursor: "pointer", py: 2}
    }, Object.values(row).map((val, idx) => /* @__PURE__ */ React.createElement(TableCell, {
      style: {paddingLeft: 0, fontWeight: 700, borderBottom: "1px solid #E7E7E7", borderTop: "1px solid #E7E7E7"},
      key: `${val}-${idx}`
    }, type === "core_user" && idx === 5 ? /* @__PURE__ */ React.createElement(DropDown, {
      size: "small",
      dropDownItems: status,
      sx: {width: 105, height: 24, fontSize: 12, fontWeight: 700},
      defaultValue: status[val].value,
      setParentValue: (value) => {
        updateStatus(Number(row?.user_id), value);
      },
      disabled: me?.level !== 1
    }) : type === "core_user" && idx === 6 ? val ? /* @__PURE__ */ React.createElement(Checkbox, {
      sx: {zIndex: 9999},
      checked: val,
      size: "small"
    }) : /* @__PURE__ */ React.createElement(Typography, {
      sx: {fontSize: 12, fontWeight: 700}
    }, "N/A") : /* @__PURE__ */ React.createElement(Box, {
      onClick: () => {
        if (me?.level === 1) {
          setUpdateModal(true);
          setCurrentUserID(row.user_id);
        }
      }
    }, type === "core_user" && idx === 3 ? /* @__PURE__ */ React.createElement(Typography, {
      sx: {fontSize: 12, fontWeight: 700, color: "#4145FF", textDecoration: "underline"}
    }, val) : /* @__PURE__ */ React.createElement(Typography, {
      sx: {fontSize: 12, fontWeight: 700}
    }, val)))));
  })))));
};
