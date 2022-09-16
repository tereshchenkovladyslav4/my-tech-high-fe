import React, { useEffect, useState } from 'react'
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
  Box,
  Checkbox,
} from '@mui/material'
import MthTableRow from '@mth/components/MthTable/MthTableRow'
import { mthTableClasses } from '@mth/components/MthTable/styles'
import { MthTableProps, MthTableRowItem } from './types'

const MthTable = <T extends unknown>({
  fields,
  items,
  loading,
  selectable = false,
  size = 'medium',
  checkBoxColor,
  oddBg = true,
  borderBottom = true,
}: MthTableProps<T>): React.ReactElement => {
  const [numSelected, setNumSelected] = useState<number>(0)
  const [rowCount, setRowCount] = useState<number>(0)
  const [expandedIdx, setExpandedIdx] = useState<number | undefined>(undefined)

  const handleToggleCheck = (item: MthTableRowItem<unknown>) => {
    item.isSelected = !item.isSelected
    checkSelectedItems()
  }
  const handleToggleCheckAll = (checked: boolean) => {
    items.map((item) => (item.isSelected = checked && item.selectable !== false))
    checkSelectedItems()
  }

  const checkSelectedItems = () => {
    setRowCount(items?.filter((item) => item.selectable !== false).length || 0)
    setNumSelected(items?.filter((item) => item.isSelected)?.length || 0)
  }

  const handleToggleExpand = (index: number) => {
    setExpandedIdx((pre) => (index === pre ? undefined : index))
  }

  useEffect(() => {
    items.map((item, idx) => {
      item.toggleExpand = () => {
        handleToggleExpand(idx)
      }
    })
  }, [items])

  return (
    <TableContainer>
      <Table
        sx={mthTableClasses.table}
        className={`${size} ${oddBg ? '' : 'noOddBg'} ${borderBottom && !oddBg ? '' : 'noBorderBottom'}`}
      >
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell className='checkWrap'>
                <Checkbox
                  color='primary'
                  size={size}
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={(_e, checked) => handleToggleCheckAll(checked)}
                />
              </TableCell>
            )}
            {fields.map((field) => (
              <TableCell key={field.key}>{field.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <MthTableRow
              key={idx}
              fields={fields}
              item={item}
              expanded={expandedIdx === idx}
              selectable={selectable}
              size={size}
              checkBoxColor={checkBoxColor}
              handleToggleCheck={handleToggleCheck}
            />
          ))}
          {!items.length && (
            <TableRow>
              <td colSpan={fields.length}>
                {loading && (
                  <Box display={'flex'} justifyContent='center' py={1}>
                    <CircularProgress />
                  </Box>
                )}
                {!loading && (
                  <Box className='no-data' sx={{ opacity: 0.1, py: 1 }}>
                    Not found
                  </Box>
                )}
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default MthTable
