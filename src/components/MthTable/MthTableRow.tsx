import React from 'react'
import { TableCell, TableRow, styled, Collapse, Typography, TableBody, Table } from '@mui/material'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthColor } from '@mth/enums'
import { convertWidth } from '@mth/utils'
import { MthTableRowItem, MthTableRowProps } from './types'

const StyledTableRow = styled(TableRow)(({}) => ({
  '& .MuiTableCell-root': {
    backgroundColor: MthColor.WHITE,
  },
  '&:nth-of-type(2n+1) .MuiTableCell-root': {
    backgroundColor: '#FAFAFA',
    '&:first-of-type': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
    '&:last-child': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },
  },
  td: {
    padding: '2px 4px 2px 0',
  },
  '.cell-item': {
    textAlign: 'left',
    paddingLeft: '14px',
  },
  '.cell-item.border-l': {
    borderLeft: '1px solid black',
  },
}))

const MthTableRow = <T extends unknown>({
  tableWidth,
  fields,
  index,
  item,
  expanded,
  selectable = false,
  isDraggable,
  size,
  checkBoxColor,
  handleToggleCheck,
}: MthTableRowProps<T>): React.ReactElement => {
  const renderDraggableTableRow = (isSelectable: boolean, provided: DraggableProvided, item: MthTableRowItem<T>) => {
    return (
      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
        <TableCell colSpan={12}>
          <Table>
            <TableBody>{renderGeneralTableRow(isSelectable, provided, item)}</TableBody>
          </Table>
        </TableCell>
      </TableRow>
    )
  }

  const renderGeneralTableRow = (isSelectable: boolean, provided: DraggableProvided, item: MthTableRowItem<T>) => {
    return (
      <>
        <StyledTableRow className={expanded ? 'expanded' : ''}>
          {isSelectable && (
            <TableCell className='checkWrap'>
              <MthCheckbox
                color={checkBoxColor}
                size={size}
                checked={item.isSelected || false}
                onChange={() => handleToggleCheck(item)}
                disabled={item.selectable === false}
              />
            </TableCell>
          )}
          {fields.map((field, indexCol) => (
            <TableCell key={indexCol} width={convertWidth(field.width || 0, tableWidth)}>
              <div className={indexCol > 0 && indexCol + 1 !== fields.length ? 'border-l cell-item' : 'cell-item'}>
                {field.formatter ? field.formatter(item, provided.dragHandleProps) : item.columns[field.key]}
              </div>
            </TableCell>
          ))}
        </StyledTableRow>
        {!!item.expandNode && (
          <>
            <TableRow />
            <TableRow>
              <TableCell sx={{ p: 0 }} colSpan={12}>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                  <Typography variant='h6' gutterBottom component='div' border={'none'}>
                    {item.expandNode}
                  </Typography>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <Draggable key={index.toString()} draggableId={index.toString()} index={index} isDragDisabled={!isDraggable}>
        {(provided: DraggableProvided) => (
          <>
            {isDraggable && renderDraggableTableRow(selectable, provided, item)}
            {!isDraggable && renderGeneralTableRow(selectable, provided, item)}
          </>
        )}
      </Draggable>
    </>
  )
}

export default MthTableRow
