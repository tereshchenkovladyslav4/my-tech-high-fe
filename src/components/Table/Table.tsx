import { TableCell, TableContainer, TableHead, TableRow, Table as MUITable, TableBody } from '@mui/material'
import { map } from 'lodash'
import React, { useState } from 'react'
import { TableTemplateType } from './types'

export const Table: TableTemplateType = ({ tableHeaders, tableBody }) => {
  const [rows] = useState(tableBody)
  
  const renderTableHeaders = () =>
    tableHeaders && (
      <TableHead>
        <TableRow>
          {map(tableHeaders, (label, idx) => (
            <TableCell sx={{ paddingY: 0 }} key={`${label}-${idx}`}>
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )

  const renderTableBody = () =>
    map(rows, (obj) => (
      <TableRow>
        {Object.values(obj).map((val, idx) => (
          <TableCell sx={{ paddingY: 0 }} key={`${val}-${idx}`}>
            {val}
          </TableCell>
        ))}
      </TableRow>
    ))

  return (
    <TableContainer>
      <MUITable>
        {renderTableHeaders()}
        <TableBody>{renderTableBody()}</TableBody>
      </MUITable>
    </TableContainer>
  )
}
