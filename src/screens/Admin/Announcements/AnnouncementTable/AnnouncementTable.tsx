import {
  Box,
  Button,
  Card,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SearchIcon from '@mui/icons-material/Search'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { useStyles } from './styles'
import { SortableTableHeader } from '../../../../components/SortableTable/SortableTableHeader/SortableTableHeader'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { ANNOUNCEMENTS } from '../../../../utils/constants'
import { gql, useQuery } from '@apollo/client'
import moment from 'moment'
import { AnnouncementType } from '../types'
import { getAnnouncementsQuery } from '../services'

type AnnouncementTableProps = {
  setPage: (value: string) => void
  setAnnouncement: (value: AnnouncementType) => void
}

type Order = 'asc' | 'desc'

const AnnouncementTable = ({ setPage, setAnnouncement }: AnnouncementTableProps) => {
  const classes = useStyles
  const history = useHistory()
  const [searchField, setSearchField] = useState<string>()
  const [tableDatas, setTableDatas] = useState<AnnouncementType[]>([])
  const [totalAnnouncements, setTotalAnnouncements] = useState<number>(0)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('date')
  const [selected, setSelected] = useState<readonly string[]>([])
  const { loading, error, data, refetch } = useQuery(getAnnouncementsQuery, {
    variables: {},
    fetchPolicy: 'network-only',
  })
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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = tableDatas.map((n, idx) => idx.toString())
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  useEffect(() => {
    if (!loading && data?.announcements) {
      setTableDatas(
        data?.announcements.map((announcement) => ({
          id: announcement.announcement_id,
          date: announcement.date ? moment(announcement.date).format('MMMM DD') : '',
          subject: announcement.subject,
          postedBy: announcement.posted_by,
          status: announcement.status,
          filterGrades: announcement.filter_grades,
          filterUsers: announcement.filter_users,
          regionId: announcement.RegionId,
          body: announcement.body,
          scheduleTime: announcement.schedule_time,
        })),
      )
      setTotalAnnouncements(data?.announcements.length)
    }
  }, [loading])

  return (
    <Card sx={classes.cardBody}>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <Subtitle size='medium' fontWeight='700'>
            Announcements
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalAnnouncements}
          </Subtitle>
        </Box>
        <Box sx={classes.pageTopRight}>
          <Button
            disableElevation
            variant='contained'
            sx={classes.addButton}
            startIcon={<AddIcon />}
            onClick={() => {
              setPage('new')
              history.push(`${ANNOUNCEMENTS}/new`)
            }}
          >
            <Subtitle sx={{ whiteSpace: 'nowrap' }}>Add Announcement</Subtitle>
          </Button>
          <Box marginLeft={4} sx={classes.search}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search title, message, or student')}
              size='small'
              fullWidth
              value={searchField}
              placeholder='Search title, message, or student'
              onChange={(e) => {}}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
      <Box sx={classes.buttonGroup}>
        <Button variant='contained' disableElevation sx={classes.inactiveButton}>
          Show Archived
        </Button>
        <Button variant='contained' disableElevation sx={classes.activeButton}>
          Hide Archived
        </Button>
      </Box>
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
              {tableDatas.map((row, index) => {
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
                    <TableCell
                      sx={classes.tableCell}
                      key={`${index}-5`}
                      onClick={() => {
                        setAnnouncement(row)
                        setPage('edit')
                        history.push(`${ANNOUNCEMENTS}/edit`)
                      }}
                    >
                      <ModeEditIcon fontSize='medium' />
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-6`}>
                      <VisibilityOutlinedIcon fontSize='medium' />
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-7`}>
                      <SystemUpdateAltIcon fontSize='medium' />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  )
}

export default AnnouncementTable
