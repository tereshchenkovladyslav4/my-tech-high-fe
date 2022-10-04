import React, { useEffect, useState } from 'react'
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Checkbox,
  CircularProgress,
  Box,
} from '@mui/material'
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import MthTableRow from '@mth/components/MthTable/MthTableRow'
import { mthTableClasses } from '@mth/components/MthTable/styles'
import { MthTableProps, MthTableRowItem } from './types'

const MthTable = <T extends unknown>({
  fields,
  items,
  loading,
  selectable = false,
  size = 'medium',
  checkBoxColor = 'primary',
  oddBg = true,
  borderBottom = true,
  isDraggable = false,
  onArrange,
}: MthTableProps<T>): React.ReactElement => {
  const [numSelected, setNumSelected] = useState<number>(0)
  const [rowCount, setRowCount] = useState<number>(0)
  const [expandedIdx, setExpandedIdx] = useState<number | undefined>(undefined)

  const handleToggleCheck = (item: MthTableRowItem<T>) => {
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

  const reorder = (list: MthTableRowItem<T>[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return
    }

    if (onArrange) {
      const newItems = reorder(items, result.source.index, result.destination.index)
      onArrange(newItems)
    }
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided: DroppableProvided) => (
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <MthTableRow
                    key={index}
                    index={index}
                    fields={fields}
                    item={item}
                    expanded={expandedIdx === index}
                    selectable={selectable}
                    isDraggable={isDraggable}
                    size={size}
                    checkBoxColor={checkBoxColor}
                    handleToggleCheck={handleToggleCheck}
                  />
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>
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
      </Table>
    </TableContainer>
  )
}
export default MthTable
