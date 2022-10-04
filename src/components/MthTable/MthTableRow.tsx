import React from 'react'
import { TableCell, TableRow, styled, Collapse, Typography } from '@mui/material'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthColor } from '@mth/enums'
import { MthTableRowProps } from './types'

const StyledTableRow = styled(TableRow)(({}) => ({
  '& .MuiTableCell-root': {
    backgroundColor: MthColor.WHITE,
  },
  '&:nth-of-type(odd) .MuiTableCell-root': {
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
  fields,
  index,
  item,
  expanded,
  selectable,
  isDraggable,
  size,
  checkBoxColor,
  handleToggleCheck,
}: MthTableRowProps<T>): React.ReactElement => {
  return (
    <>
      <Draggable key={index.toString()} draggableId={index.toString()} index={index} isDragDisabled={!isDraggable}>
        {(provided: DraggableProvided) => (
          <StyledTableRow className={expanded ? 'expanded' : ''} ref={provided.innerRef} {...provided.draggableProps}>
            {selectable && (
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
              <TableCell key={indexCol} width={field.width}>
                <div className={indexCol > 0 && indexCol + 1 !== fields.length ? 'border-l cell-item' : 'cell-item'}>
                  {field.formatter ? field.formatter(item, provided.dragHandleProps) : item.columns[field.key]}
                </div>
              </TableCell>
            ))}
          </StyledTableRow>
        )}
      </Draggable>
      {!!item.expandNode && (
        <>
          <TableRow />
          <TableRow>
            <TableCell sx={{ p: 0 }} colSpan={12}>
              <Collapse in={expanded} timeout='auto' unmountOnExit>
                <Typography variant='h6' gutterBottom component='div'>
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

export default MthTableRow
