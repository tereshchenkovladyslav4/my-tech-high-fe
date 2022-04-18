import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT, GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT } from '../../../../utils/constants'
import SearchIcon from '@mui/icons-material/Search'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { ApplicationEmailModal as EmailModal } from '../../../../components/EmailModal/ApplicationEmailModal'
import { useQuery, useMutation } from '@apollo/client'
import {
  getApplicationsQuery,
  approveApplicationMutation,
  deleteApplicationMutation,
  emailApplicationMutation,
  moveThisYearApplicationMutation,
  moveNextYearApplicationMutation,
  getSchoolYearQuery,
  updateApplicationMutation,
  toggleHideApplicationMutation,
} from '../services'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import { map, parseInt } from 'lodash'
import moment from 'moment'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { ApplicationModal } from '../ApplicationModal/ApplicationModal'
import { ApplicationEmailModal } from '../ApplicationModal/ApplicationEmailModal'
export const ApplicationTable = ({ filter }) => {
  const [emailTemplate, setEmailTemplate] = useState()
  const [pageLoading, setPageLoading] = useState(false)
  const [seachField, setSearchField] = useState('')
  const [shouldClear, setShouldClear] = useState(false)
  const [open, setOpen] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [paginatinLimit, setPaginatinLimit] = useState(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState('status|ASC')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [tableData, setTableData] = useState<Array<any>>([])
  const [applicationIds, setApplicationIds] = useState<Array<string>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [acceptMidYear, setAcceptMidYear] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState([])
  const [editData, setEditData] = useState<any>()
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [emailHostory, setEmailHistory] = useState([])
  const specialEds = ['None', 'IEP', '504', 'Exit']
  const status = ['New', 'Sibling', 'Returning', 'Hidden']
  const createData = (application: any) => {
    return {
      id: application.application_id,
      submitted: application.date_submitted ? moment(application.date_submitted).format('MM/DD/YY') : null,
      year: `${moment(application.school_year.date_begin).format('YYYY')}-${moment(
        application.school_year.date_end,
      ).format('YY')}`,
      student: `${application.student.person.last_name}, ${application.student.person.first_name}`,
      grade:
        application.student.grade_levels.length &&
        (application.student.grade_levels[0].grade_level.includes('Kin')
          ? 'K'
          : application.student.grade_levels[0].grade_level),
      sped: application.student.special_ed ? 'Yes' : 'No',
      parent: `${application.student.parent.person.last_name}, ${application.student.parent.person.first_name}`,
      // status: application.status,
      relation: application.relation_status ? status[application.relation_status] : 'New',
      verified: application?.student?.parent?.person?.email_verifier?.verified ? 'Yes' : 'No',
      emailed:
        application.application_emails.length > 0 ? (
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(application)}>
            {moment(application.application_emails[0].created_at).format('MM/DD/YY')}
          </Box>
        ) : null,
      actions: (
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <Box display={'flex'} flexDirection={'column'} marginRight={4} sx={{ width: 15 }}>
            {application.hidden ? (
              <Paragraph
                size='medium'
                sx={{ cursor: 'pointer' }}
                fontWeight='700'
                onClick={() => handleToggleHideApplication(application.application_id, false)}
              >
                Unhide
              </Paragraph>
            ) : (
              <Paragraph
                size='medium'
                sx={{ cursor: 'pointer' }}
                fontWeight='700'
                onClick={() => handleToggleHideApplication(application.application_id, true)}
              >
                Hide
              </Paragraph>
            )}
            <Paragraph
              size='medium'
              sx={{ cursor: 'pointer' }}
              fontWeight='700'
              onClick={() => handleEditApplication(application)}
            >
              Edit
            </Paragraph>
          </Box>
          <Box
            onClick={(event) => handleDelete(application.application_id)}
            sx={{
              borderRadius: 1,
              cursor: 'pointer',
            }}
          >
            <svg width='14' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
                fill='#323232'
              />
            </svg>
          </Box>
        </Box>
      ),
    }
  }

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearQuery)
  const { called, loading, error, data, refetch } = useQuery(getApplicationsQuery, {
    variables: {
      filter: filter,
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: seachField,
    },
    fetchPolicy: 'network-only',
  })
  const {
    loading: templateLoading,
    data: emailTemplateData,
    refetch: refetchEmailTemplate,
  } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Application Page',
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
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])
  useEffect(() => {
    setSchoolYears(schoolYearData?.schoolYears)
  }, [schoolLoading])

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
          if (editData && editData.application_id === application.application_id) {
            setEditData(application)
          }
          return createData(application)
        })
      })
      setTotalApplications(total)
    }
  }, [data])

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
  const tableHeaders: HeadCell[] = [
    // {
    // 	id: 'id',
    // 	numeric: false,
    // 	disablePadding: true,
    // 	label: 'ID'
    // },
    {
      id: 'submitted',
      numeric: false,
      disablePadding: true,
      label: 'Submitted',
    },
    {
      id: 'year',
      numeric: false,
      disablePadding: true,
      label: 'Year',
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
      id: 'sped',
      numeric: false,
      disablePadding: true,
      label: 'SPED',
    },
    {
      id: 'parent',
      numeric: false,
      disablePadding: true,
      label: 'Parent',
    },
    // {
    //   id: 'status',
    //   numeric: false,
    //   disablePadding: true,
    //   label: 'Status',
    // },
    {
      id: 'relation',
      numeric: false,
      disablePadding: true,
      label: 'Relation',
    },
    {
      id: 'verified',
      numeric: false,
      disablePadding: true,
      label: 'Verified',
    },
    {
      id: 'emailed',
      numeric: false,
      disablePadding: true,
      label: 'Emailed',
    },
    {
      id: 'Actions',
      numeric: false,
      disablePadding: true,
      label: 'Actions',
    },
  ]

  const [deleteApplication, { data: deleteData }] = useMutation(deleteApplicationMutation)
  const handleDelete = async (id) => {
    await deleteApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: [id],
        },
      },
    })
    refetch()
  }

  const handleDeleteSelected = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true)
      return
    }
    await deleteApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: applicationIds,
        },
      },
    })
    refetch()
  }

  const handleApplicationAccept = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true)
      return
    }
    await approveApplicationAction()
  }
  const [approveApplication, { data: dt }] = useMutation(approveApplicationMutation)

  const approveApplicationAction = async () => {
    await approveApplication({
      variables: {
        acceptApplicationInput: {
          application_ids: applicationIds,
          midyear_application: acceptMidYear,
        },
      },
    })
    refetch()
  }
  const [emailApplication, { data: emailStatus }] = useMutation(emailApplicationMutation)

  const onSendEmail = async (subject: string, body: string) => {
    if (applicationIds.length === 0) {
      return
    }
    try {
      await emailApplication({
        variables: {
          emailApplicationInput: {
            application_ids: applicationIds.map((item) => parseInt(item)),
            subject: subject,
            body: body,
          },
        },
      })
      refetchEmailTemplate()
      refetch()
      setOpen(false)
    } catch (error) {}
  }
  const handleEmailSend = (subject: string, body: string) => {
    if (applicationIds.length === 0) {
      return
    }
    onSendEmail(subject, body)
  }
  const handleOpenEmailModal = () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true)
    } else {
      setOpen(true)
    }
  }

  const [moveThisYearApplication, { data: thisYearData }] = useMutation(moveThisYearApplicationMutation)

  const handleMoveToThisYear = async () => {
    try {
      if (applicationIds.length === 0) {
        setOpenAlert(true)
        return
      }
      await moveThisYearApplication({
        variables: {
          deleteApplicationInput: {
            application_ids: applicationIds,
          },
        },
      })
      refetch()
    } catch (error) {}
  }
  const [moveNextYearApplication, { data: nextYearData }] = useMutation(moveNextYearApplicationMutation)

  const handleMoveToNextYear = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true)
      return
    }
    await moveNextYearApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: applicationIds,
        },
      },
    })
    refetch()
  }

  const handleChangeMidYer = (e) => {
    setAcceptMidYear(e.target.checked)
  }

  const handleEditApplication = (data) => {
    setEditData(data)
    setOpenEditModal(true)
  }
  const [updateApplication, { data: updatedData }] = useMutation(updateApplicationMutation)
  const handleSaveApplication = async (data) => {
    await updateApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(data.application_id),
          school_year_id: Number(data.school_year_id),
          status: data.status,
          midyear_application: data.midyear_application === 'true' ? true : false,
        },
      },
    })
    refetch()
    setOpenEditModal(false)
  }
  const [toogleHideApplication, { data: toggleData }] = useMutation(toggleHideApplicationMutation)
  const handleToggleHideApplication = async (application_id, status) => {
    await toogleHideApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(application_id),
          midyear_application: status,
          relation_status: '1',
          school_year_id: 1,
        },
      },
    })
    refetch()
  }
  const handleOpenEmailHistory = (data) => {
    setEmailHistory(data?.application_emails)
    setOpenEmailModal(true)
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
            Applications
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
              value={seachField}
              placeholder='Search...'
              onChange={(e) => {
                handlePageChange(1),
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
            onClick={handleMoveToThisYear}
          >
            Move Application to This Year
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
            onClick={handleMoveToNextYear}
          >
            Move Applications to Next Year
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'left',
          marginTop: '12px',
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
              width: '92px',
              background: RED_GRADIENT,
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
            }}
            onClick={handleDeleteSelected}
          >
            Delete
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
          marginY: '12px',
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
          <Button
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              height: 29,
              background: BUTTON_LINEAR_GRADIENT,
              color: 'white',
              marginRight: '12px',
              width: '92px',
            }}
            onClick={handleApplicationAccept}
          >
            Accept
          </Button>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox value={acceptMidYear} onChange={handleChangeMidYer} />}
              label='Accept as Mid-year'
            />
          </FormGroup>
        </Box>
        <Pagination
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil((totalApplications as number) / paginatinLimit) || 0}
          currentPage={currentPage}
        />
      </Box>
      <SortableTable rows={tableData} headCells={tableHeaders} onCheck={setApplicationIds} clearAll={shouldClear} onSortChange={sortChangeAction}/>
      {open && (
        <EmailModal
          handleModem={() => setOpen(!open)}
          title={applicationIds.length + ' Recipients'}
          handleSubmit={handleEmailSend}
          template={emailTemplate}
        />
      )}
      {openAlert && (
        <WarningModal
          handleModem={() => setOpenAlert(!openAlert)}
          title='Warning'
          subtitle='Please select applications'
          btntitle='Close'
          handleSubmit={() => setOpenAlert(!openAlert)}
        />
      )}
      {openEditModal && (
        <ApplicationModal
          handleModem={() => setOpenEditModal(!openEditModal)}
          handleSubmit={(data) => handleSaveApplication(data)}
          data={editData}
          schoolYears={schoolYears}
          handleRefetch={refetch}
        />
      )}
      {openEmailModal && (
        <ApplicationEmailModal
          handleModem={() => setOpenEmailModal(!openEditModal)}
          handleSubmit={() => setOpenEmailModal(false)}
          data={emailHostory}
        />
      )}
    </Card>
  )
}
