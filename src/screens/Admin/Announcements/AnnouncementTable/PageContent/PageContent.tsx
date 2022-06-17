import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { HeadCell } from '../../../../../components/SortableTable/SortableTableHeader/types'
import { useStyles } from '../styles'
import { SortableTableHeader } from '../../../../../components/SortableTable/SortableTableHeader/SortableTableHeader'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { ANNOUNCEMENTS } from '../../../../../utils/constants'
import { toolTipStyles } from '../../types'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import { Announcement } from '../../../../Dashboard/Announcements/types'

type PageContentProps = {
  tableDatas: Announcement[]
  showArchivedAnnouncement: boolean
  setAnnouncement: (value: Announcement) => void
  handleArchiveChangeStatus: (value: Announcement) => void
}

type Order = 'asc' | 'desc'

const PageContent = ({
  tableDatas,
  showArchivedAnnouncement,
  setAnnouncement,
  handleArchiveChangeStatus,
}: PageContentProps) => {
  const classes = useStyles
  const toolTipClasses = toolTipStyles()
  const history = useHistory()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('date')
  const [selected, setSelected] = useState<readonly string[]>([])
  const tableHeaders: HeadCell[] = [
    {
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date',
    },
    {
      id: 'subject',
      numeric: false,
      disablePadding: true,
      label: 'Subject',
    },
    {
      id: 'postedBy',
      numeric: false,
      disablePadding: true,
      label: 'Posted By',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
    },
  ]

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {}

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <TableContainer>
        <Table sx={{ width: '87%', minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
          <SortableTableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy.toString()}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={tableDatas.length}
            headCells={tableHeaders}
            noCheckbox
          />
          <TableBody>
            {tableDatas
              .filter(
                (item) =>
                  (showArchivedAnnouncement && item.isArchived) || (!showArchivedAnnouncement && !item.isArchived),
              )
              .map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index} sx={{ cursor: 'pointer', py: 2 }}>
                    <TableCell sx={classes.tableCell} key={`${index}-1`}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#A1A1A1' }}>{row.date}</Typography>
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-2`}>
                      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{row.subject}</Typography>
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-3`}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{row.postedBy}</Typography>
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-4`}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{row.status}</Typography>
                    </TableCell>
                    {!row.isArchived && (
                      <TableCell
                        sx={classes.tableCell}
                        key={`${index}-5`}
                        onClick={() => {
                          setAnnouncement(row)
                          history.push(`${ANNOUNCEMENTS}/edit`)
                        }}
                      >
                        <Tooltip
                          title='Edit'
                          placement='top'
                          classes={{
                            tooltip: toolTipClasses.customTooltip,
                          }}
                        >
                          <ModeEditIcon fontSize='medium' />
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell
                      sx={classes.tableCell}
                      key={`${index}-6`}
                      onClick={() => {
                        setAnnouncement(row)
                        history.push(`${ANNOUNCEMENTS}/view`)
                      }}
                    >
                      <Tooltip
                        title='View'
                        placement='top'
                        classes={{
                          tooltip: toolTipClasses.customTooltip,
                        }}
                      >
                        <VisibilityOutlinedIcon fontSize='medium' />
                      </Tooltip>
                    </TableCell>
                    {!row.isArchived ? (
                      <TableCell
                        sx={classes.tableCell}
                        key={`${index}-7`}
                        onClick={() => handleArchiveChangeStatus(row)}
                      >
                        <Tooltip
                          title='Archive'
                          placement='top'
                          classes={{
                            tooltip: toolTipClasses.customTooltip,
                          }}
                        >
                          <SystemUpdateAltIcon fontSize='medium' />
                        </Tooltip>
                      </TableCell>
                    ) : (
                      <TableCell
                        sx={classes.tableCell}
                        key={`${index}-7`}
                        onClick={() => handleArchiveChangeStatus(row)}
                      >
                        <Tooltip
                          title='Unarchive'
                          placement='top'
                          classes={{
                            tooltip: toolTipClasses.customTooltip,
                          }}
                        >
                          <CallMissedOutgoingIcon fontSize='medium' />
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PageContent
