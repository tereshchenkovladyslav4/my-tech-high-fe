import React, { useEffect, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { EmailHistoryModal } from '@mth/components/EmailHistoryModal/EmailHistoryModal'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField } from '@mth/components/MthTable/types'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ScheduleStatus } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { RED_GRADIENT } from '../../../../utils/constants'
import { EmailModal } from '../ScheduleModal/ScheduleEmailModal'
import { ScheduleTableFilters } from '../ScheduleTableFilters/ScheduleTableFilters'
import { emailScheduleMutation, getSchedulesQuery, scheduleCountQuery } from '../services'
import { FiltersProps, ScheduleFilterVM, ScheduleCount, TableData } from '../type'

export const ScheduleTable: React.FC<FiltersProps> = ({ filter, setFilter }) => {
  const history = useHistory()
  const { me } = useContext(UserContext)
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [seachField, setSearchField] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [clearAll, setClearAll] = useState<boolean>(false)
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState<string>('status|ASC')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [tableData, setTableData] = useState<Array<TableData>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedYearId, setSelectedYearId] = useState<number>(0)
  const [filters, setFilters] = useState<ScheduleFilterVM>({ status: ['Submitted', 'Resubmitted'] })
  const [emailHistory, setEmailHistory] = useState([])
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [editFrom, setEditFrom] = useState<boolean>(false)

  const initialFilters = ['Not Submitted', 'Updates Required', 'Updates Requested', 'Resubmitted', 'Submitted']
  const [scheduleCount, setScheduleCount] = useState<ScheduleCount>({
    Submitted: 0,
    Resubmitted: 0,
    Accepted: 0,
    'Updates Requested': 0,
    'Updates Required': 0,
    'Not Submitted': 0,
  })
  const scheduleIds = React.useRef<Array<number>>()

  const checker = (arr: string[], target: string[]) => target.every((v) => arr.includes(v))
  const createData = (schedule) => {
    const gradeArray = schedule.ScheduleStudent.grade_levels
    let gradeLevel =
      gradeArray.length &&
      (gradeArray[0].grade_level.includes('Kin')
        ? 'K'
        : gradeArray[0]?.grade_level.includes('undefined')
        ? ''
        : gradeArray[0]?.grade_level)

    if (filter?.grades != undefined && checker(filter?.grades, ['K', '1-8', '9-12'])) {
      if (gradeLevel == 'K') gradeLevel = 'K'
      else if (Number(gradeLevel) >= 1 && Number(gradeLevel) <= 8) gradeLevel = '1-8'
      else gradeLevel = '9-12'
    }

    const dateToDisplay = moment(
      schedule.status === ScheduleStatus.ACCEPTED
        ? schedule.date_accepted
        : schedule.status === ScheduleStatus.SUBMITTED || schedule.status === ScheduleStatus.RESUBMITTED
        ? schedule.date_submitted
        : schedule.last_modified,
    ).format('MM/DD/YY')

    return {
      key: schedule.schedule_id.toString(),
      columns: {
        id: schedule.schedule_id,
        date: dateToDisplay.includes('Invalid') ? '' : dateToDisplay,
        status: schedule.status,
        student: `${schedule.ScheduleStudent.person?.last_name}, ${schedule.ScheduleStudent.person?.first_name}`,
        studentId: +schedule.ScheduleStudent.student_id,
        grade: gradeLevel,
        parent: `${schedule.ScheduleStudent.parent.person?.last_name}, ${schedule.ScheduleStudent.parent.person?.first_name}`,
        diploma: schedule.ScheduleStudent.diploma_seeking === 1 ? 1 : 0,
        emailed:
          schedule.ScheduleEmails?.length > 0 ? (
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(schedule)}>
              {moment(schedule.ScheduleEmails[schedule.ScheduleEmails.length - 1].created_at).format('MM/DD/YY')}
            </Box>
          ) : null,
      },
    }
  }

  const handleOpenEmailHistory = (data) => {
    setEmailHistory(data?.ScheduleEmails)
    setOpenEmailModal(true)
  }

  const { data: countGroup } = useQuery(scheduleCountQuery, {
    variables: {
      scheduleGroupCountArgs: {
        region_id: me?.selectedRegionId,
        filter,
      },
    },
    fetchPolicy: 'network-only',
  })

  const { data, refetch } = useQuery(getSchedulesQuery, {
    variables: {
      filter: { ...filter, ...filters },
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: seachField,
      regionId: me?.selectedRegionId,
    },
    skip: !me?.selectedRegionId,
    fetchPolicy: 'network-only',
  })

  const handlePageChange = (page: number) => {
    localStorage.setItem('currentPage', page.toString())
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  useEffect(() => {
    scheduleIds.current = []
    setClearAll(!clearAll)
    setCurrentPage(1)
    setSkip(0)
  }, [me?.selectedRegionId])

  useEffect(() => {
    if (pageLoading) {
      setSkip(0)
      setCurrentPage(1)
    }
  }, [filter])

  useEffect(() => {
    if (data !== undefined) {
      setPageLoading(true)
      const { schedules } = data
      const { results, total } = schedules

      const createdData = results.map((schedule) => createData(schedule))
      if (sort.includes('date|asc')) {
        createdData.sort((a, b) => {
          if (a.columns.date) {
            return new Date(a.columns.date).getTime() - new Date(b.columns.date).getTime()
          } else {
            return -1
          }
        })
      }
      if (sort.includes('date|desc')) {
        createdData.sort((a, b) => {
          if (b.columns.date) {
            return new Date(b.columns.date).getTime() - new Date(a.columns.date).getTime()
          } else {
            return -1
          }
        })
      }

      setTableData(createdData)
      setTotalApplications(total)
    }
  }, [data])

  useEffect(() => {
    if (countGroup) {
      setScheduleCount(countGroup.scheduleCountByRegionId.results)
    }
  }, [countGroup])

  useEffect(() => {
    setSort('status|ASC')
    if (localStorage.getItem('currentPage')) {
      handlePageChange(Number(localStorage.getItem('currentPage')))
    }
    if (localStorage.getItem('pageLimit')) {
      setPaginatinLimit(Number(localStorage.getItem('pageLimit')))
    }
    return () => {
      localStorage.removeItem('currentPage')
      localStorage.removeItem('pageLimit')
    }
  }, [])

  const [modalSelectedStatus, setModalSelectedStatus] = useState<Array<string>>([])
  const [recipientByStatus, setRecipientByStatus] = useState<number>(0)
  const handleSchedulesByStatus = (status: string) => {
    const valueByStatus = scheduleCount[status as keyof typeof scheduleCount]
    const indexToDelete = modalSelectedStatus.indexOf(status)
    const tempArray = modalSelectedStatus
    if (indexToDelete === -1) {
      setRecipientByStatus(recipientByStatus + valueByStatus)
      tempArray.push(status)
      setEditFrom(true)
    } else {
      setRecipientByStatus(recipientByStatus - valueByStatus)
      tempArray.splice(indexToDelete, 1)
      if (tempArray.length <= 0) {
        setEditFrom(false)
      } else {
        setEditFrom(true)
      }
    }
    setModalSelectedStatus([...tempArray])
  }

  const [emailApplication] = useMutation(emailScheduleMutation)

  const onSendEmail = async (from: string, subject: string, body: string) => {
    if (!scheduleIds.current || (scheduleIds?.current?.length === 0 && recipientByStatus === 0)) {
      return
    }
    setOpen(false)
    try {
      await emailApplication({
        variables: {
          emailScheduleInput: {
            schedule_ids: scheduleIds?.current?.length > 0 ? scheduleIds.current : [],
            schedule_status: modalSelectedStatus ?? [],
            from: from,
            subject: subject,
            body: body,
          },
        },
      })
      refetch()
      scheduleIds.current = []
      setRecipientByStatus(0)
      setModalSelectedStatus([])
    } catch (error) {}
  }
  const handleEmailSend = (from: string, subject: string, body: string) => {
    if (scheduleIds?.current?.length === 0 && recipientByStatus === 0) {
      return
    }
    onSendEmail(from, subject, body)
  }
  const handleOpenEmailModal = () => {
    if (scheduleIds?.current && scheduleIds?.current?.length > 0) {
      setEditFrom(true)
    } else {
      setEditFrom(false)
    }
    setOpen(true)
  }
  const handleChangePageLimit = (value: number) => {
    localStorage.setItem('pageLimit', `${value}`)
    handlePageChange(1)
    setPaginatinLimit(value)
  }

  const handleModem = () => {
    setOpen(!open)
    setRecipientByStatus(0)
    setModalSelectedStatus([])
  }

  const fields: MthTableField<unknown>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      tdClass: '',
      width: '0',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      tdClass: '',
      width: '0',
      formatter: (item: MthTableField<unknown>) => {
        return (
          <Box
            display={'flex'}
            flexDirection='row'
            justifyContent={'flex-start'}
            flexWrap={'wrap'}
            onClick={() => {
              if (item.columns.status !== ScheduleStatus.NOT_SUBMITTED) {
                history.push(`/enrollment/enrollment-schedule/${item.columns.studentId}`)
              }
            }}
          >
            <Box sx={{ cursor: item.columns.status === ScheduleStatus.NOT_SUBMITTED ? 'auto' : 'pointer' }}>
              {item.columns.status}
            </Box>
          </Box>
        )
      },
    },
    {
      key: 'student',
      label: 'Student',
      sortable: true,
      tdClass: '',
      width: '0',
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      tdClass: '',
      width: '0',
    },
    {
      key: 'parent',
      label: 'Parent',
      sortable: true,
      tdClass: '',
      width: '0',
    },
    {
      key: 'diploma',
      label: 'Diploma',
      sortable: true,
      tdClass: '',
      width: '0',
    },
    {
      key: 'emailed',
      label: 'Emailed',
      sortable: true,
      tdClass: '',
      width: '10px',
    },
    {
      key: 'blank',
      label: '',
      sortable: false,
      tdClass: '',
      width: '0',
    },
  ]

  const onSelectionChange = (items) => {
    const newScheduleIds: Array<number> = []
    items.map((item) => {
      if (item.isSelected) {
        newScheduleIds.push(item.columns.id)
      }
    })
    scheduleIds.current = [...newScheduleIds]
  }

  const onSortChange = (filedKey: string, order: string) => {
    if (filedKey === 'date') {
      setSort(`${filedKey}|${order.toLocaleLowerCase() === 'asc' ? 'desc' : 'asc'}`)
    } else {
      setSort(`${filedKey}|${order}`)
    }

    refetch()
  }

  return (
    <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: '12px' }}>
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingX: '24px',
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Subtitle size='medium' fontWeight='700'>
            Schedules
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalApplications}
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
              value={seachField}
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
          <SchoolYearDropDown
            selectedYearId={selectedYearId}
            setSelectedYearId={(value) => {
              setSelectedYearId(value)
              setFilters({ ...filters, selectedYearId: +value })
              setFilter({ ...filter, selectedYearId: +value })
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginY: '12px',
          paddingX: '24px',
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
        />
        <Pagination
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil((totalApplications as number) / paginatinLimit) || 0}
          currentPage={currentPage}
        />
      </Box>
      <Box sx={{ paddingX: '24px' }}>
        <ScheduleTableFilters
          filters={filters}
          setFilters={(value) => {
            setFilters(value)
            handlePageChange(1)
          }}
          scheduleCount={scheduleCount}
        />
      </Box>
      <Box>
        <MthTable
          items={tableData}
          fields={fields}
          selectable={true}
          checkBoxColor='primary'
          onSelectionChange={onSelectionChange}
          onSortChange={onSortChange}
          isTableCellBorder={false}
        />
      </Box>
      {open && (
        <EmailModal
          handleModem={handleModem}
          title={
            (scheduleIds?.current && scheduleIds.current.length > 0 ? scheduleIds.current.length : recipientByStatus) +
            ' Recipient' +
            (scheduleIds?.current && scheduleIds.current.length + recipientByStatus ? 's' : '')
          }
          handleSubmit={handleEmailSend}
          editFrom={editFrom}
          isNonSelected={scheduleIds?.current && scheduleIds.current.length === 0 ? true : false}
          filters={
            scheduleIds.current?.length === 0
              ? initialFilters
              : tableData
                  .filter((td) => scheduleIds.current?.find((sid) => sid === td.columns.id))
                  .map((obj) => obj.columns.status)
          }
          handleSchedulesByStatus={handleSchedulesByStatus}
        />
      )}
      {openEmailModal && (
        <EmailHistoryModal handleModem={() => {}} handleSubmit={() => setOpenEmailModal(false)} data={emailHistory} />
      )}
    </Card>
  )
}
