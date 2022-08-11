import React, { FunctionComponent, useState } from 'react'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { SortableTableHeader } from '../../../../../components/SortableTable/SortableTableHeader/SortableTableHeader'
import { ANNOUNCEMENTS } from '../../../../../utils/constants'
import { ANNOUNCEMENT_HEADCELLS } from '../../../../../utils/PageHeadCellsConstant'
import { Announcement } from '../../../../Dashboard/Announcements/types'
import { toolTipStyles } from '../../types'
import { useStyles } from '../styles'

type PageContentProps = {
  tableDatas: Announcement[]
  showArchivedAnnouncement: boolean
  setAnnouncement: (value: Announcement) => void
  handleArchiveChangeStatus: (value: Announcement) => void
  handleDelete: (id: number) => void
}

type Order = 'asc' | 'desc'

const PageContent: FunctionComponent<PageContentProps> = ({
  tableDatas,
  showArchivedAnnouncement,
  setAnnouncement,
  handleArchiveChangeStatus,
  handleDelete,
}) => {
  const classes = useStyles
  const toolTipClasses = toolTipStyles()
  const history = useHistory()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof string>('date')
  const [selected] = useState<readonly string[]>([])
  const handleSelectAllClick = () => {}
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof string) => {
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
            headCells={ANNOUNCEMENT_HEADCELLS}
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
                      row.status === 'Published' ? (
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
                        <TableCell sx={classes.tableCell} key={`${index}-7`} onClick={() => handleDelete(row.id)}>
                          <Tooltip
                            title='Delete'
                            placement='top'
                            classes={{
                              tooltip: toolTipClasses.customTooltip,
                            }}
                          >
                            <svg
                              width='14'
                              height='18'
                              viewBox='0 0 14 18'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
                                fill='#323232'
                              />
                            </svg>
                          </Tooltip>
                        </TableCell>
                      )
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
