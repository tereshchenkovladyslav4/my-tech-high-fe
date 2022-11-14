import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableBody, TableRow, TableCell, Checkbox } from '@mui/material'
import { Box } from '@mui/system'
import { MTHBLUE } from '../../utils/constants'
import { SortableTableHeader } from './SortableTableHeader/SortableTableHeader'
import { tableClasses } from './styles'
import { Order, SortableTableTemplateType } from './types'

export const SortableTable: SortableTableTemplateType = ({
  headCells,
  rows,
  onCheck,
  clearAll,
  onRowClick,
  onSortChange,
  onParentClick,
  hideCheck = false,
  hover = true,
}) => {
  const [order, setOrder] = useState<Order>(Order.ASC)
  const [orderBy, setOrderBy] = useState<keyof unknown>('name')
  const [selected, setSelected] = useState<readonly string[]>([])

  useEffect(() => {
    if (onCheck) {
      onCheck(selected)
    }
  }, [selected])

  useEffect(() => {
    setSelected([])
  }, [clearAll])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof unknown) => {
    const isAsc = orderBy === property && order === Order.ASC
    setOrder(isAsc ? Order.DESC : Order.ASC)
    setOrderBy(property)
    if (onSortChange) onSortChange(property, isAsc ? Order.DESC : Order.ASC)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: { id: number }) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleRowClick = (id: string): void => {
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

  const isSelected = (name: number): boolean => selected.indexOf(name) !== -1

  const getColor = (key: string): string => {
    switch (key) {
      case 'emailed':
        return MTHBLUE
      default:
        return ''
    }
  }

  const handleCellClick = (key: string, row: { id: number }) => {
    switch (key) {
      case 'student': {
        if (onRowClick) onRowClick(row.id)
        break
      }
      case 'parent': {
        if (onParentClick) onParentClick(row.id)
        break
      }
      case 'subject': {
        if (onRowClick) onRowClick(row.id)
        break
      }
    }
  }
  return (
    <Box sx={{ width: '100%', overflow: 'hidden', paddingX: '24px' }}>
      <TableContainer>
        <Table aria-labelledby='tableTitle' size='small'>
          <SortableTableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy.toString()}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
            noCheckbox={hideCheck}
          />
          <TableBody>
            {rows.map((row: unknown) => {
              const isItemSelected = isSelected(row.id)
              const labelId = `enhanced-table-checkbox-${row.id}`
              return (
                <TableRow
                  hover={hover}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ borderBottom: '1.5px solid #E7E7E7', height: '60px' }}
                >
                  {!hideCheck && (
                    <TableCell
                      padding='checkbox'
                      onClick={() => {
                        handleRowClick(row.id)
                      }}
                      sx={{ minHeight: '60px' }}
                    >
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                  )}
                  {Object.keys(row).map((key, idx) => {
                    return (
                      key !== 'id' && (
                        <TableCell
                          key={idx}
                          sx={{
                            ...tableClasses.tableCell,
                            color: getColor(key, row[key]),
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCellClick(key, row)
                          }}
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
