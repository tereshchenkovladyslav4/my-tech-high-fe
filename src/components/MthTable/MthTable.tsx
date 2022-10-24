import React, { useEffect, useRef, useState } from 'react'
import { TableCell, TableContainer, TableHead, TableRow, Table, TableBody, CircularProgress, Box } from '@mui/material'
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import MthTableRow from '@mth/components/MthTable/MthTableRow'
import { mthTableClasses } from '@mth/components/MthTable/styles'
import { convertWidth } from '@mth/utils'
import { MthTableProps, MthTableRowItem } from './types'

const MthTable = <T extends unknown>({
  fields,
  items,
  loading,
  selectable = false,
  showSelectAll = true,
  disableSelectAll = false,
  size = 'medium',
  checkBoxColor = 'primary',
  oddBg = true,
  borderBottom = true,
  isDraggable = false,
  isMultiRowExpandable = false,
  onArrange,
  onSelectionChange,
  sx = [],
}: MthTableProps<T>): React.ReactElement => {
  const [numSelected, setNumSelected] = useState<number>(0)
  const [rowCount, setRowCount] = useState<number>(0)
  const [expandedIdx, setExpandedIdx] = useState<Array<number>>([])
  const [tableWidth, setTableWidth] = useState<number>(0)
  const tableRef = useRef<HTMLDivElement>(null)

  const handleToggleCheck = (item: MthTableRowItem<T>) => {
    item.isSelected = !item.isSelected
    checkSelectedItems()
    handleSelectionChange()
  }
  const handleToggleCheckAll = (checked: boolean) => {
    items.map((item) => (item.isSelected = checked && item.selectable !== false))
    checkSelectedItems()
    handleSelectionChange()
  }

  const checkSelectedItems = () => {
    setRowCount(items?.filter((item) => item.selectable !== false).length || 0)
    setNumSelected(items?.filter((item) => item.isSelected)?.length || 0)
  }

  const handleSelectionChange = () => {
    if (onSelectionChange) onSelectionChange(items)
  }

  const handleToggleExpand = (index: number) => {
    if (!expandedIdx.includes(index)) {
      if (isMultiRowExpandable) {
        setExpandedIdx((prev) => [...prev, index])
      } else {
        setExpandedIdx([index])
      }
    } else {
      setExpandedIdx((prev) => prev.filter((item) => item !== index))
    }
  }

  const reorder = (list: MthTableRowItem<T>[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    if (expandedIdx.includes(startIndex)) {
      let temp = [...expandedIdx]
      temp = temp.filter((item) => item !== startIndex)
      temp.push(endIndex)
      setExpandedIdx(temp)
    }
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
    checkSelectedItems()
  }, [items, expandedIdx])

  useEffect(() => {
    const handleWindowResize = () => {
      setTableWidth(tableRef.current?.clientWidth || 0)
    }
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <div ref={tableRef}>
      <TableContainer>
        <Table
          sx={[mthTableClasses.table, ...(Array.isArray(sx) ? sx : [sx])]}
          className={`${size} ${oddBg ? '' : 'noOddBg'} ${borderBottom && !oddBg ? '' : 'noBorderBottom'}`}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell className='checkWrap'>
                  <MthCheckbox
                    color='primary'
                    size={size}
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={(_e, checked) => handleToggleCheckAll(checked)}
                    sx={{ visibility: !showSelectAll ? 'hidden' : 'unset' }}
                    disabled={disableSelectAll}
                  />
                </TableCell>
              )}
              {fields.map((field) => (
                <TableCell key={field.key} width={convertWidth(field.width || 0, tableRef.current?.clientWidth || 0)}>
                  {field.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='droppable'>
              {(provided: DroppableProvided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <MthTableRow
                      key={`${uuidv4()}`}
                      tableWidth={tableWidth}
                      index={index}
                      fields={fields}
                      item={item}
                      expanded={expandedIdx.includes(index)}
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
          {!items.length && !!tableWidth && (
            <TableRow>
              <td colSpan={fields.length}>
                {loading && (
                  <Box display={'flex'} justifyContent='center' py={1}>
                    <CircularProgress />
                  </Box>
                )}
              </td>
            </TableRow>
          )}
        </Table>
      </TableContainer>
    </div>
  )
}
export default MthTable
