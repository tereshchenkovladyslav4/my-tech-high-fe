import React, { useState, FunctionComponent } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { ApplicationEmailModal as EmailModal } from '../../../../components/EmailModal/ApplicationEmailModal'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { RED_GRADIENT } from '../../../../utils/constants'
import { ENROLLMENT_SCHEDULE_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { ScheduleTableFilters } from '../ScheduleTableFilters/ScheduleTableFilters'
import { SchoolYearDropDown } from '../SchoolYearDropdown/SchoolYearDropdown'
import { ScheduleTableProps } from '../type'

export const ScheduleTable: FunctionComponent<ScheduleTableProps> = () => {
  const [searchField, setSearchField] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const totalSchedules = 5
  const [scheduleIds, setScheduleIds] = useState<Array<string>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [selectedYearId, setSelectedYearId] = useState<number>(0)
  const [filters, setFilters] = useState(['Submitted', 'Resubmitted', 'Updates Requested', 'Updates Required'])

  const tableData = [
    {
      id: '1',
      date: '06/14/2021',
      status: 'Submitted',
      student: 'Smith, Hunter',
      grade: 'K',
      parent: 'Smith, John',
      diploma: '',
      emailed: '',
    },
    {
      id: '2',
      date: '06/14/2021',
      status: 'Resubmitted',
      student: 'Smith, Sally',
      grade: '10',
      parent: 'Smith, John',
      diploma: '',
      emailed: '09/09/21',
    },
    {
      id: '3',
      date: '06/14/2021',
      status: 'Not Submitted',
      student: 'Smith, Hunter',
      grade: 'K',
      parent: 'Smith, John',
      diploma: '',
      emailed: '09/09/21',
    },
    {
      id: '4',
      date: '06/14/2021',
      status: 'Submitted',
      student: 'Smith, Hunter',
      grade: 'K',
      parent: 'Smith, John',
      diploma: '',
      emailed: '',
    },
    {
      id: '5',
      date: '06/14/2021',
      status: 'Submitted',
      student: 'Smith, Hunter',
      grade: 'K',
      parent: 'Smith, John',
      diploma: '',
      emailed: '',
    },
  ]

  const scheduleCount = {
    Submitted: 1,
    Resubmitted: 2,
    'Updates Requested': 1,
    'Updates Required': 2,
    'Not Submitted': 1,
    Accepted: 1,
  }

  const handlePageChange = (page: number) => {
    localStorage.setItem('currentPage', page.toString())
    setCurrentPage(page)
  }

  const handleEmailSend = () => {
    if (scheduleIds.length === 0) {
      return
    }
  }
  const handleOpenEmailModal = () => {
    if (scheduleIds.length === 0) {
      setOpenAlert(true)
    } else {
      setOpen(true)
    }
  }

  const handleChangePageLimit = (value) => {
    localStorage.setItem('pageLimit', value)
    handlePageChange(1)
    setPaginatinLimit(value)
  }

  const sortChangeAction = () => {
    // TODO - Should be defined actions
  }

  return (
    <Card
      sx={{ marginTop: '12px', paddingTop: '19px', paddingLeft: 2, paddingRight: 2, marginBottom: 4, paddingBottom: 4 }}
    >
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
            Students
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 5 }}>
            5
          </Subtitle>
          <Box marginLeft={4}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              sx={{
                minWidth: '250px',
              }}
              value={searchField}
              placeholder='Search...'
              onChange={(e) => {
                handlePageChange(1)
                setSearchField(e.target.value)
              }}
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
            justifyContent: 'space-between',
            marginLeft: '59px',
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
              width: '100px',
              marginRight: 2,
              height: '33px',
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
              minWidth: '100px',
            }}
            onClick={handleOpenEmailModal}
          >
            Email
          </Button>
          <SchoolYearDropDown selectedYearId={selectedYearId} setSelectedYearId={setSelectedYearId} />
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginY: 5,
        }}
      >
        <Pagination
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil((totalSchedules as number) / paginatinLimit) || 1}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <ScheduleTableFilters filters={filters} setFilters={setFilters} scheduleCount={scheduleCount} />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={ENROLLMENT_SCHEDULE_HEADCELLS}
        onCheck={setScheduleIds}
        onSortChange={sortChangeAction}
      />
      {open && (
        <EmailModal
          handleModem={() => setOpen(!open)}
          title={scheduleIds.length + ' Recipient' + (scheduleIds.length > 1 ? 's' : '')}
          handleSubmit={handleEmailSend}
          template={''}
        />
      )}
      {openAlert && (
        <WarningModal
          handleModem={() => setOpenAlert(!openAlert)}
          title='Warning'
          subtitle='Please select schedule'
          btntitle='Close'
          handleSubmit={() => setOpenAlert(!openAlert)}
        />
      )}
    </Card>
  )
}
