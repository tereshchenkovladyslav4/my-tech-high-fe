import React from 'react'
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  styled,
  TableBody,
  CircularProgress,
  Box,
} from '@mui/material'
import { CustomTableTemplateType } from './types'

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
    fontSize: '0.875rem',
  },
  '.cell-item.border-l': {
    borderLeft: '1px solid black',
  },
}))

const CustomTable: CustomTableTemplateType = ({ fields, items, loading }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableCell style={{ fontSize: 16, fontWeight: 700 }} key={field.key}>
                {field.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <StyledTableRow key={`row_${idx}`}>
              {fields.map((field, indexCol) => (
                <td key={`row_${idx}_col_${field.key}`}>
                  <div className={indexCol > 0 && indexCol + 1 !== fields.length ? 'border-l cell-item' : 'cell-item'}>
                    {field.formatter ? field.formatter(item[field.key], item, idx) : item[field.key]}
                  </div>
                </td>
              ))}
            </StyledTableRow>
          ))}
          {!items.length && (
            <StyledTableRow>
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
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default CustomTable
