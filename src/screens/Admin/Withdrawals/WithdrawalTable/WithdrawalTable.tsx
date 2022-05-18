import { Box, Button, Card, FormControl, InputAdornment, MenuItem, OutlinedInput, Select } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SearchIcon from '@mui/icons-material/Search'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useQuery, useMutation } from '@apollo/client'
import { getWithdrawalsQuery } from '../services'
import { map } from 'lodash'
import moment from 'moment'
import DeleteForever from '@mui/icons-material/Delete'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { WithdrawalFilters } from '../WithdrawalFilters'
import { ProfileContext } from '../../../../providers/ProfileProvider/ProfileContext'
import { makeStyles } from '@material-ui/styles'
import { useStyles } from './styles'

const selectStyles = makeStyles({
  select: {
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
})

const WithdrawalTable = () => {
  const classes = useStyles
  const selectedClass = selectStyles()
  const [filters, setFilters] = useState(['Submitted', 'Resubmitted'])
  const [searchField, setSearchField] = useState('')
  const [tableData, setTableData] = useState<Array<any>>([])
  const [selectedYear, setSelectedYear] = useState<string | number>('1')
  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [skip, setSkip] = useState<number>()
  const [sort, setSort] = useState('status|ASC')
  const selectClasses = selectStyles()
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0)
  const [withdrawIds, setWithdrawIds] = useState<Array<string>>([])
  const [isShowModal, setIsShowModal] = useState(false)
  const [enrollmentPackets, setEnrollmentPackets] = useState<Array<Packet>>([])
  const [enrollmentPacket, setEnrollmentPacket] = useState<Packet | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [openWarningModal, setOpenWarningModal] = useState<boolean>(false)
  const [withdrawCount, setWithdrawCount] = useState<Array<String>>([])
  const { showModal, hideModal, store, setStore } = useContext(ProfileContext)
  const { loading, error, data, refetch } = useQuery(getWithdrawalsQuery, {
    variables: {},
    fetchPolicy: 'network-only',
  })
  const schoolYears = [
    {
      label: '21-22',
      value: '1',
    },
    {
      label: '22-23',
      value: '2',
    },
    {
      label: '23-24',
      value: '3',
    },
  ]

  const handleOpenProfile = (rowId: number) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId)
    showModal(row.student.parent)
    setStore(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const handlePacketSelect = (rowId: any) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId)
    setEnrollmentPacket(row)
    setIsShowModal(true)
  }

  const headCells: HeadCell[] = [
    {
      id: 'submitted',
      numeric: false,
      disablePadding: true,
      label: 'Submitted',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
    },
    {
      id: 'effective',
      numeric: false,
      disablePadding: true,
      label: 'Effective',
    },
    {
      id: 'student',
      numeric: false,
      disablePadding: true,
      label: 'Student',
    },
    {
      id: 'grade',
      numeric: false,
      disablePadding: true,
      label: 'Grade',
    },
    {
      id: 'soe',
      numeric: false,
      disablePadding: true,
      label: 'SoE',
    },
    {
      id: 'funding',
      numeric: false,
      disablePadding: true,
      label: 'Funding',
    },
    {
      id: 'emailed',
      numeric: false,
      disablePadding: true,
      label: 'Emailed',
    },
  ]

  const handleOpenEmailModal = () => {
    if (withdrawIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setOpenEmailModal(true)
  }

  useEffect(() => {
    if (!loading && data?.withdrawals) {
      setTableData(
        data?.withdrawals.map((withdrawal) => ({
          submitted: withdrawal.date ? moment(withdrawal.date).format('MM/DD/YYYY') : '',
          status: withdrawal.status,
          effective: withdrawal.date_effective ? moment(withdrawal.date_effective).format('MM/DD/YYYY') : '',
          student: withdrawal?.Student?.person?.first_name + ', ' + withdrawal?.Student?.person?.last_name,
          grade: withdrawal?.Student?.grade_levels[0]?.grade_level,
          soe: withdrawal?.soe,
          funding: withdrawal?.funding,
          emailed: withdrawal?.date_emailed ? moment(withdrawal.date_emailed).format('MM/DD/YYYY') : '',
          id: withdrawal?.withdrawal_id,
        })),
      )
      setTotalWithdrawals(data?.withdrawals.length)
    }
  }, [loading])

  return (
    <Card sx={classes.card}>
      {/*  Headers */}
      <Box sx={classes.pageHeader}>
        <Box sx={classes.pageHeaderContent}>
          <Subtitle size='medium' fontWeight='700'>
            Withdrawals
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalWithdrawals}
          </Subtitle>
          <Box marginLeft={4} sx={{ width: '300px' }}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={searchField}
              placeholder='Search...'
              onChange={(e) => setSearchField(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
        <Box sx={classes.pageHeaderButtonGroup}>
          <Button sx={classes.emailButton} onClick={handleOpenEmailModal}>
            Email
          </Button>
          <Button
            sx={classes.withdrawalButton}
            //onClick={handleMoveToThisYear}
          >
            Withdrawal
          </Button>
          <Button
            sx={classes.reinstateButton}
            //onClick={handleMoveToNextYear}
          >
            Reinstate
          </Button>
        </Box>
      </Box>
      {/*  Pagination & Actions */}
      <Box sx={classes.container}>
        <Box sx={classes.content}>
          <Box sx={classes.buttonDiv}>
            <Button
              sx={classes.quickWithdrawalButton}
              //onClick={handleDeleteSelected}
            >
              Quick Withdrawal
            </Button>
          </Box>
        </Box>
        <Pagination
          setParentLimit={setPaginatinLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil(totalWithdrawals / paginatinLimit)}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <WithdrawalFilters filters={filters} setFilters={setFilters} withdrawCount={withdrawCount} />
      </Box>
      <Box display='flex' flexDirection='row' justifyContent='end' sx={{ mr: 3 }} alignItems='center'>
        <FormControl variant='standard' sx={{ m: 1 }}>
          <Select
            size='small'
            value={selectedYear}
            IconComponent={ExpandMoreIcon}
            disableUnderline
            onChange={(e) => {
              setSelectedYear(e.target.value)
            }}
            label='year'
            className={selectedClass.select}
            sx={{ color: 'blue', border: 'none' }}
          >
            {schoolYears.map((sy) => (
              <MenuItem key={sy.value} value={sy.value}>
                {sy.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <SortableTable
        rows={tableData}
        headCells={headCells}
        onCheck={setWithdrawIds}
        clearAll={false}
        onRowClick={handlePacketSelect}
        onParentClick={handleOpenProfile}
        //onSortChange={sortChangeAction}
      />
      {openWarningModal && (
        <WarningModal
          title='Warning'
          subtitle='Please select Packets'
          btntitle='Close'
          handleModem={() => setOpenWarningModal(!openWarningModal)}
          handleSubmit={() => setOpenWarningModal(!openWarningModal)}
        />
      )}
    </Card>
  )
}

export default WithdrawalTable
