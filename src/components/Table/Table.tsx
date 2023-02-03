import React, { useEffect, useState } from 'react'
import { TableCell, TableContainer, TableHead, TableRow, Table as MUITable, TableBody } from '@mui/material'
import { map } from 'lodash'
import { TableProps } from './types'

export const Table: React.FC<TableProps> = ({ tableHeaders, tableBody, isHover = false }) => {
  const [rows, setRows] = useState<Record<string | number, React.ReactNode>[]>()

  useEffect(() => {
    setRows(tableBody)
  }, [tableBody])

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
      <TableRow hover={isHover ? true : false}>
        {Object.values(obj).map((val, idx) => (
          <TableCell
            sx={{
              paddingY: 0,
            }}
            key={`${val}-${idx}`}
          >
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
