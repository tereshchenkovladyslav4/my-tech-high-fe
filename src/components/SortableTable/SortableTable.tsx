import { TableContainer, Table, TableBody, TableRow, TableCell, Checkbox } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { SortableTableHeader } from './SortableTableHeader/SortableTableHeader'
import { Order, SortableTableTemplateType } from './types'

export const SortableTable: SortableTableTemplateType = ({ headCells, rows, onCheck, clearAll, onRowClick }) => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('name')
  const [selected, setSelected] = useState<readonly string[]>([])

  useEffect(() => {
    onCheck(selected)
  }, [selected])

  useEffect(() => {
    setSelected([])
  }, [clearAll])

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  type Order = 'asc' | 'desc'

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      }
      return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, idx) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: any, id: string) => {
    const classes = event.target.getAttribute('class')
    if (classes && classes.includes('delete-row')) {
      return false
    }
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='small'>
          <SortableTableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy.toString()}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => {
              const isItemSelected = isSelected(row.id.toString())
              const labelId = `enhanced-table-checkbox-${row.id}`

              return (
                <TableRow
                  hover
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell padding='checkbox' onClick={(event) => {
                    handleClick(event, row.id)
                  }}>
                    <Checkbox
                      color='primary'
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </TableCell>
                  {Object.keys(row).map((key, idx) => {
                    return key === 'student' ? (
                      <TableCell
                        key={idx}
                        sx={{
                          paddichngY: 1,
                          paddingLeft: 0,
                          textAlign: idx !== 0 && 'left',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onRowClick && onRowClick(row.id)
                        }}
                      >
                        {row[key] || ''}
                      </TableCell>
                    ) : (
                      key !== 'id' && (
                        <TableCell
                          key={idx}
                          sx={{
                            paddingY: 1,
                            paddingLeft: 0,
                            textAlign: idx !== 0 && "left",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          //   onRowClick && onRowClick(row.id);
                          // }}
                        >
                          {row[key] || ''}
                        </TableCell>
                      )
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
