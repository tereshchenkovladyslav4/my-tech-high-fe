import React, { useEffect, useRef, useState } from 'react'
import { ArrowDropDown } from '@mui/icons-material'
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
  Box,
  TableFooter,
  TableSortLabel,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import MthTableRow from '@mth/components/MthTable/MthTableRow'
import { mthTableClasses } from '@mth/components/MthTable/styles'
import { convertWidth } from '@mth/utils'
import { Order } from '../SortableTable/types'
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
  onArrange,
  onSelectionChange,
  onSortChange,
  sx = [],
}: MthTableProps<T>): React.ReactElement => {
  const [numSelected, setNumSelected] = useState<number>(0)
  const [rowCount, setRowCount] = useState<number>(0)
  const [tableWidth, setTableWidth] = useState<number>(0)
  const tableRef = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState<Order>(Order.ASC)
  const [orderBy, setOrderBy] = useState<string>('name')

  const handleRequestSort = (fieldKey: string) => {
    const isAsc = orderBy === fieldKey && order === Order.ASC
    setOrder(isAsc ? Order.DESC : Order.ASC)
    setOrderBy(fieldKey)
    if (onSortChange) onSortChange(fieldKey, isAsc ? Order.DESC : Order.ASC)
  }

  const handleToggleCheck = (item: MthTableRowItem<T>) => {
    item.isSelected = !item.isSelected
    checkSelectedItems()
    handleSelectionChange(false)
  }
  const handleToggleCheckAll = (checked: boolean) => {
    items.map((item) => (item.isSelected = checked && item.selectable !== false))
    checkSelectedItems()
    handleSelectionChange(true)
  }

  const checkSelectedItems = () => {
    setRowCount(items?.filter((item) => item.selectable !== false).length || 0)
    setNumSelected(items?.filter((item) => item.isSelected)?.length || 0)
  }

  const handleSelectionChange = (isAll: boolean) => {
    if (onSelectionChange) onSelectionChange(items, isAll)
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
    checkSelectedItems()
  }, [items])

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
                  {field.sortable ? (
                    <TableSortLabel
                      active={true}
                      // active={orderBy === headCell.id}
                      // direction={orderBy === headCell.id ? order : 'asc'}
                      direction={orderBy === field.key ? order : 'desc'}
                      onClick={() => handleRequestSort(field.key)}
                      IconComponent={ArrowDropDown}
                    >
                      {field.label}
                      {orderBy === field.key ? (
                        <Box component='span' sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    field.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {!!isDraggable ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='droppable'>
                {(provided: DroppableProvided) => (
                  <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map((item, index) => (
                      <MthTableRow
                        key={`${item.key}`}
                        tableWidth={tableWidth}
                        index={index}
                        fields={fields}
                        item={item}
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
          ) : (
            <TableBody>
              {items.map((item, index) => (
                <MthTableRow
                  key={`${item.key}`}
                  tableWidth={tableWidth}
                  index={index}
                  fields={fields}
                  item={item}
                  selectable={selectable}
                  isDraggable={isDraggable}
                  size={size}
                  checkBoxColor={checkBoxColor}
                  handleToggleCheck={handleToggleCheck}
                />
              ))}
            </TableBody>
          )}
          {!items.length && !!tableWidth && (
            <TableFooter>
              <TableRow>
                <td colSpan={fields.length}>
                  {loading && (
                    <Box display={'flex'} justifyContent='center' py={1}>
                      <CircularProgress />
                    </Box>
                  )}
                </td>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </div>
  )
}
export default MthTable
