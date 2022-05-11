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
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SearchIcon from '@mui/icons-material/Search'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { useStyles } from './styles'
import { SortableTableHeader } from '../../../../components/SortableTable/SortableTableHeader/SortableTableHeader'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

type AnnouncementType = {
  date: string
  subject: string
  postedBy: string
  status: string
}

type Order = 'asc' | 'desc'

const AnnouncementTable = () => {
  const classes = useStyles
  const [searchField, setSearchField] = useState<string>()
  const [tableDatas, setTableDatas] = useState<AnnouncementType[]>([])
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
    const announcements = [
      {
        date: 'September 12',
        subject: 'Highlighting our new MTH Game Maker coursel',
        status: 'Published',
        postedBy: 'My Teach',
      },
      {
        date: 'September 12',
        subject: 'Highlighting our new MTH Game Maker coursel',
        postedBy: 'My Teach',
        status: 'Draft',
      },
      {
        date: 'September 12',
        subject: 'Highlighting our new MTH Game Maker coursel',
        postedBy: 'My Teach',
        status: 'Scheduled',
      },
    ]
    setTableDatas(announcements)
  }, [])

  return (
    <Card sx={classes.cardBody}>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <Subtitle size='medium' fontWeight='700'>
            Announcements
          </Subtitle>
        </Box>
        <Box sx={classes.pageTopRight}>
          <Button disableElevation variant='contained' sx={classes.addButton} startIcon={<AddIcon />}>
            <Subtitle sx={{ whiteSpace: 'nowrap' }}>Add Announcement</Subtitle>
          </Button>
          <Box marginLeft={4} sx={classes.search}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search title, message or student')}
              size='small'
              fullWidth
              value={searchField}
              placeholder='Search title, message or student'
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
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{row.subject}</Typography>
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-3`}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{row.postedBy}</Typography>
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-4`}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{row.status}</Typography>
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-4`}>
                      <ModeEditIcon fontSize='medium' />
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-4`}>
                      <VisibilityOutlinedIcon fontSize='medium' />
                    </TableCell>
                    <TableCell sx={classes.tableCell} key={`${index}-4`}>
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
