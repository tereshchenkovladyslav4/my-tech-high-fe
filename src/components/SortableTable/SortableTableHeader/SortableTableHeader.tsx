import React from 'react'
import { ArrowDropDown } from '@mui/icons-material'
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from '@mui/material'
import { Box } from '@mui/system'
import { visuallyHidden } from '@mui/utils'
import { SortableTableHeaders } from './types'
export const SortableTableHeader: SortableTableHeaders = ({
  numSelected,
  onRequestSort,
  onSelectAllClick,
  order,
  orderBy,
  rowCount,
  headCells,
  noCheckbox,
}) => {
  const createSortHandler = (property: keyof unknown) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {!noCheckbox && (
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {headCells.map((headCell, idx) => (
          <TableCell
            sx={{ fontWeight: 700 }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {idx !== headCells.length && (
              <TableSortLabel
                active={true}
                // active={orderBy === headCell.id}
                // direction={orderBy === headCell.id ? order : 'asc'}
                direction={orderBy === headCell.id ? order : 'desc'}
                onClick={createSortHandler(headCell.id)}
                IconComponent={ArrowDropDown}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
