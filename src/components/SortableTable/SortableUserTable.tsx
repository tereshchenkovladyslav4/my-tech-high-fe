import { Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Divider } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState, useContext } from "react";
import { DropDown } from "../DropDown/DropDown";
import { SortableTableHeader } from "./SortableTableHeader/SortableTableHeader";
import { SortableTableTemplateType } from "./types";

import { UpdateUserModal } from '../../screens/Admin/Users/UpdateUserModal/UpdateUserModal';
import { UserContext } from "../../providers/UserContext/UserProvider";



export const SortableUserTable: SortableTableTemplateType = ({
  headCells,
  type,
  rows,
  onCheck,
  updateStatus,
  clearAll,
}) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('name');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const { me } = useContext(UserContext);

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
    onCheck(selected)
  }, [selected])

  useEffect(() => {
    setSelected([]);
  }, [clearAll])

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
      a: { [key in Key]: number | string },
      b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, idx) => idx);
      setSelected(newSelecteds)
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  const isSelected = (name: string) => selected.indexOf(name) !== -1;


  return (
    <Box sx={{ width: '100%', padding: 3 }}>

      {currentUserID && updateModal &&
        <UpdateUserModal
          visible={updateModal}
          userID={currentUserID}
          handleModem={() => setUpdateModal(false)}
        />
      }

      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <SortableTableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
            noCheckbox
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      // handleClick(event, row.user_id);
                    }}
                    tabIndex={-1}
                    key={index}
                    sx={{ cursor: "pointer", py: 2 }}
                  >
                    {Object.values(row).map((val: any, idx: number) => (
                      <TableCell style={{ paddingLeft: 0, fontWeight: 700, borderBottom: "1px solid #E7E7E7", borderTop: "1px solid #E7E7E7" }} key={`${val}-${idx}`}>
                        {type === "core_user" && idx === 5 ?
                          <DropDown
                            size='small'
                            dropDownItems={status}
                            sx={{ width: 105, height: 24, fontSize: 12, fontWeight: 700 }}
                            defaultValue={status[val].value}
                            setParentValue={(value: any) => {
                              updateStatus(Number(row?.user_id), value);
                            }}
                            disabled={me?.level !== 1}
                          />
                          :
                          type === "core_user" && idx === 6 ?
                            val ?
                              <Checkbox
                                sx={{ zIndex: 9999 }}
                                checked={val}
                                size="small"
                              />
                              :
                              <Typography sx={{ fontSize: 12, fontWeight: 700, }}>N/A</Typography>
                            :
                            <Box onClick={() => {
                              if (me?.level === 1) {
                                setUpdateModal(true)
                                setCurrentUserID(row.user_id);
                              }
                            }}>
                              {type === "core_user" && idx === 3 ?
                                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#4145FF", textDecoration: "underline" }}>{val}</Typography>
                                :
                                <Typography sx={{ fontSize: 12, fontWeight: 700, }}>{val}</Typography>
                              }
                            </Box>
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
