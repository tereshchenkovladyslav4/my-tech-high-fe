import React from 'react'
import { TableCell, TableRow, styled, Checkbox, Collapse, Typography } from '@mui/material'
import { MthTableRowProps } from './types'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
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
  item,
  expanded,
  selectable,
  size,
  checkBoxColor,
  handleToggleCheck,
}: MthTableRowProps<T>): React.ReactElement => {
  return (
    <>
      <StyledTableRow className={expanded ? 'expanded' : ''}>
        {selectable && (
          <TableCell className='checkWrap'>
            <Checkbox
              color='primary'
              size={size}
              checked={item.isSelected || false}
              sx={{
                '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: checkBoxColor },
                '& .MuiSvgIcon-root': { color: checkBoxColor },
                visibility: `${item.selectable === false ? 'hidden' : ''}`,
              }}
              onChange={() => handleToggleCheck(item)}
            />
          </TableCell>
        )}
        {fields.map((field, indexCol) => (
          <TableCell key={indexCol}>
            <div className={indexCol > 0 && indexCol + 1 !== fields.length ? 'border-l cell-item' : 'cell-item'}>
              {field.formatter ? field.formatter(item) : item.columns[field.key]}
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
