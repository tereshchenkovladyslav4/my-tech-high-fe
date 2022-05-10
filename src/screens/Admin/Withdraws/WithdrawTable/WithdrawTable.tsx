import { Box, Button, Card, FormControl, InputAdornment, MenuItem, OutlinedInput, Select } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT, BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'
import SearchIcon from '@mui/icons-material/Search'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useQuery, useMutation } from '@apollo/client'
import {
  emailPacketMutation,
  deletePacketMutation,
  moveNextYearPacketMutation,
  moveThisYearPacketMutation,
} from '../services'
import { map } from 'lodash'
import moment from 'moment'
import DeleteForever from '@mui/icons-material/Delete'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import { WithdrawFilters } from '../WithdrawFilters'
import { ProfileContext } from '../../../../providers/ProfileProvider/ProfileContext'
import { makeStyles } from '@material-ui/styles'

const selectStyles = makeStyles({
  select: {
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
})

const WithdrawTable = () => {
  const { me, setMe } = useContext(UserContext)
  const [filters, setFilters] = useState(['Submitted', 'Resubmitted'])

  const [emailTemplate, setEmailTemplate] = useState()
  const [searchField, setSearchField] = useState('')
  // const [tableData, setTableData] = useState<Array<any>>([])
  const [selectedYear, setSelectedYear] = useState<string | number>('1')
  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [skip, setSkip] = useState<number>()
  const [sort, setSort] = useState('status|ASC')
  const selectClasses = selectStyles()
  const [totalPackets, setTotalPackets] = useState<number>()
  const [withdrawIds, setWithdrawIds] = useState<Array<string>>([])

  const [isShowModal, setIsShowModal] = useState(false)
  const [enrollmentPackets, setEnrollmentPackets] = useState<Array<Packet>>([])
  const [enrollmentPacket, setEnrollmentPacket] = useState<Packet | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [openWarningModal, setOpenWarningModal] = useState<boolean>(false)
  const [withdrawCount, setWithdrawCount] = useState<Array<String>>([])
  const { showModal, hideModal, store, setStore } = useContext(ProfileContext)
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

  const tableData = [
    {
      submitted: '09/09/21',
      status: 'Requested',
      effective: '09/09/21',
      student: 'Smith, Hunter',
      grade: '10',
      soe: 'Nebo',
      funding: 'Yes',
      emailed: '09/09/21',
      id: '1',
    },
    {
      submitted: '09/09/21',
      status: 'Notified',
      effective: '10/01/21',
      student: 'Smith, Hunter',
      grade: '12',
      soe: 'GPA',
      funding: 'No',
      emailed: '09/09/21',
      id: '2',
    },
    {
      submitted: '09/09/21',
      status: 'Withdrawn',
      effective: '09/09/21',
      student: 'Smith, Hunter',
      grade: '10',
      soe: 'Nebo',
      funding: 'No',
      emailed: '09/09/21',
      id: '3',
    },
    {
      submitted: '09/09/21',
      status: 'Requested',
      effective: '09/09/21',
      student: 'Smith, Hunter',
      grade: '10',
      soe: 'Nebo',
      funding: 'No',
      emailed: '',
      id: '4',
    },
  ]

  const handleOpenEmailModal = () => {
    if (withdrawIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setOpenEmailModal(true)
  }

  return (
    <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: '12px' }}>
      {/*  Headers */}
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '24px',
            alignItems: 'center',
          }}
        >
          <Subtitle size='medium' fontWeight='700'>
            Withdraws
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalPackets}
          </Subtitle>
          <Box marginLeft={4}>
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
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-end',
            marginRight: '24px',
          }}
        >
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              background: RED_GRADIENT,
              color: 'white',
              width: '157px',
              marginRight: 2,
              height: '33px',
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
            }}
            onClick={handleOpenEmailModal}
          >
            Email
          </Button>
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              height: '33px',
              background: YELLOW_GRADIENT,
              color: 'white',
              width: '195px',
              marginRight: 2,
              '&:hover': {
                background: '#FFD626',
                color: '#fff',
              },
            }}
            //onClick={handleMoveToThisYear}
          >
            Withdraw
          </Button>
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              height: '33px',
              background: GREEN_GRADIENT,
              color: 'white',
              width: '195px',
              '&:hover': {
                background: '#33FF7C',
                color: 'fff',
              },
            }}
            //onClick={handleMoveToNextYear}
          >
            Reinstate
          </Button>
        </Box>
      </Box>
      {/*  Pagination & Actions */}
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginY: 4,
          marginRight: '24px',
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'left',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'left',
              justifyContent: 'flex-end',
              marginLeft: '24px',
            }}
          >
            <Button
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 29,
                color: 'white',
                width: '150px',
                background: BUTTON_LINEAR_GRADIENT,
                '&:hover': {
                  background: '#D23C33',
                  color: '#fff',
                },
              }}
              //onClick={handleDeleteSelected}
            >
              Quick Withdraw
            </Button>
          </Box>
        </Box>
        <Pagination
          setParentLimit={setPaginatinLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil(totalPackets / paginatinLimit)}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <WithdrawFilters filters={filters} setFilters={setFilters} withdrawCount={withdrawCount} />
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
            className={selectClasses.select}
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

export default WithdrawTable
