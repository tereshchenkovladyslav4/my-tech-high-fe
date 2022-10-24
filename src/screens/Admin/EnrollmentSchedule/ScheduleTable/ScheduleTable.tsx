import React, { useEffect, useState, useContext, FunctionComponent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { map, parseInt } from 'lodash'
import moment from 'moment'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { RED_GRADIENT } from '../../../../utils/constants'
import { ENROLLMENT_SCHEDULE_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { EmailModal } from '../ScheduleModal/ScheduleEmailModal'
import { ScheduleTableFilters } from '../ScheduleTableFilters/ScheduleTableFilters'
import { SchoolYearDropDown } from '../SchoolYearDropDown/SchoolYearDropDown'
import { getApplicationsQuery, emailApplicationMutation } from '../services'
import { ApplicationTableProps, EmailTemplateVM } from '../type'

export const ScheduleTable: FunctionComponent<ApplicationTableProps> = ({ filter }) => {
  const { me } = useContext(UserContext)
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateVM>()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [seachField, setSearchField] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [clearAll, setClearAll] = useState<boolean>(false)
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState<string>('status|ASC')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [tableData, setTableData] = useState<Array<unknown>>([])
  const [applicationIds, setApplicationIds] = useState<Array<string>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedYearId, setSelectedYearId] = useState<number>(0)
  const [filters, setFilters] = useState<Array<string>>([])
  const initialFilters = [
    'Not Submitted',
    'Updates Required',
    'Updates Requested',
    'Resubmitted',
    'Submitted',
    'Accepted',
  ]
  const [scheduleCount, setScheduleCount] = useState({})

  const checker = (arr: string[], target: string[]) => target.every((v) => arr.includes(v))

  const createData = (application: unknown) => {
    let grade_level =
      application.student.grade_levels.length &&
      (application.student.grade_levels[0].grade_level.includes('Kin')
        ? 'K'
        : application.student.grade_levels[0].grade_level)

    if (filter?.grades != undefined && checker(filter?.grades, ['K', '1-8', '9-12'])) {
      if (grade_level == 'K') grade_level = 'K'
      else if (Number(grade_level) >= 1 && Number(grade_level) <= 8) grade_level = '1-8'
      else grade_level = '9-12'
    }

    return {
      id: application.application_id,
      submitted: application.date_submitted ? moment(application.date_submitted).format('MM/DD/YY') : null,
      status: application.status,
      student: `${application.student.person?.last_name}, ${application.student.person?.first_name}`,
      grade: grade_level,
      parent: `${application.student.parent.person?.last_name}, ${application.student.parent.person?.first_name}`,
      verified: application?.student?.parent?.person?.email_verifier?.verified ? 'Yes' : 'No',
      emailed:
        application.application_emails.length > 0 ? (
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(application)}>
            {moment(application.application_emails[application.application_emails.length - 1].created_at).format(
              'MM/DD/YY',
            )}
          </Box>
        ) : null,
    }
  }

  const { data, refetch } = useQuery(getApplicationsQuery, {
    variables: {
      filter: filter,
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: seachField,
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  const { data: emailTemplateData, refetch: refetchEmailTemplate } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Application Page',
      regionId: me?.selectedRegionId,
    },
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
    setApplicationIds([])
    setClearAll(!clearAll)
    setCurrentPage(1)
    setSkip(0)
  }, [me?.selectedRegionId])

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  useEffect(() => {
    if (pageLoading) {
      setSkip(0)
      setCurrentPage(1)
    }
  }, [filter])

  useEffect(() => {
    if (data !== undefined) {
      setPageLoading(true)
      const { applications } = data
      const { results, total } = applications

      setTableData(() => {
        return map(results, (application) => {
          return createData(application)
        })
      })
      setTotalApplications(total)
    }
  }, [data])

  useEffect(() => {
    setScheduleCount({
      Submitted: tableData.filter((item) => item.status === 'Submitted').length,
      Resubmitted: tableData.filter((item) => item.status === 'Resubmitted').length,
      Accepted: tableData.filter((item) => item.status === 'Accepted').length,
      'Updates Requested': tableData.filter((item) => item.status === 'Updates Requested').length,
      'Updates Required': tableData.filter((item) => item.status === 'Updates Required').length,
      'Not Submitted': tableData.filter((item) => item.status === 'Not Submitted').length,
    })
  }, [tableData])

  useEffect(() => {
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
  const [modalScheduleIds, setModalScheduleIds] = useState<Array<string>>([])
  const handleSchedulesByStatus = (status: string) => {
    const indexToDelet = modalSelectedStatus.indexOf(status)
    if (indexToDelet === -1) {
      const tempArray = modalSelectedStatus
      tempArray.push(status)
      setModalSelectedStatus([...tempArray])
      const tempScheduleIds = modalScheduleIds
      tableData
        .filter((item) => item.status === status)
        .map((item) => {
          tempScheduleIds.push(item.id.toString())
        })
      setModalScheduleIds([...tempScheduleIds])
    } else {
      const tempArray = modalSelectedStatus
      tempArray.splice(indexToDelet, 1)
      setModalSelectedStatus([...tempArray])
      let tempScheduleIds = modalScheduleIds
      tableData
        .filter((item) => item.status === status)
        .map((item) => {
          tempScheduleIds = findElementAndDelete(tempScheduleIds, item.id.toString())
        })
      setModalScheduleIds([...tempScheduleIds])
    }
  }

  const findElementAndDelete = (array: Array<string>, element: string) => {
    const indexToDelet = array.indexOf(element)
    array.splice(indexToDelet, 1)
    return array
  }

  const [emailApplication] = useMutation(emailApplicationMutation)

  const onSendEmail = async (from: string, subject: string, body: string) => {
    if (applicationIds.length === 0 && modalScheduleIds.length === 0) {
      return
    }
    try {
      await emailApplication({
        variables: {
          emailApplicationInput: {
            application_ids: (applicationIds.length > 0 ? applicationIds : modalScheduleIds).map((item) =>
              parseInt(item),
            ),
            from: from,
            subject: subject,
            body: body,
          },
        },
      })
      refetchEmailTemplate()
      refetch()
      setOpen(false)
      setModalScheduleIds([])
      setModalSelectedStatus([])
    } catch (error) {}
  }
  const handleEmailSend = (from: string, subject: string, body: string) => {
    if (applicationIds.length === 0 && modalScheduleIds.length === 0) {
      return
    }
    onSendEmail(from, subject, body)
  }
  const handleOpenEmailModal = () => {
    setOpen(true)
  }
  const handleChangePageLimit = (value) => {
    localStorage.setItem('pageLimit', value)
    handlePageChange(1)
    setPaginatinLimit(value)
  }

  const sortChangeAction = (property, order) => {
    setSort(`${property}|${order}`)
    refetch()
  }

  const handleModem = () => {
    setOpen(!open)
    setModalScheduleIds([])
    setModalSelectedStatus([])
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
            Students
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
          <SchoolYearDropDown selectedYearId={selectedYearId} setSelectedYearId={setSelectedYearId} />
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
        <ScheduleTableFilters filters={filters} setFilters={setFilters} scheduleCount={scheduleCount} />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={ENROLLMENT_SCHEDULE_HEADCELLS}
        onCheck={setApplicationIds}
        onSortChange={sortChangeAction}
        clearAll={clearAll}
      />
      {open && (
        <EmailModal
          handleModem={handleModem}
          title={
            (applicationIds.length > 0 ? applicationIds.length : modalScheduleIds.length) +
            ' Recipient' +
            (applicationIds.length + modalScheduleIds.length > 1 ? 's' : '')
          }
          handleSubmit={handleEmailSend}
          template={emailTemplate}
          editFrom={true}
          isNonSelected={applicationIds.length === 0}
          filters={filters.length === 0 ? initialFilters : filters}
          handleSchedulesByStatus={handleSchedulesByStatus}
        />
      )}
    </Card>
  )
}
