import React, { useEffect, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput, Tooltip } from '@mui/material'
import { map, parseInt } from 'lodash'
import moment from 'moment'
import { ApplicationEmailModal as EmailModal } from '@mth/components/EmailModal/ApplicationEmailModal'
import { EditYearModal } from '@mth/components/EmailModal/EditYearModal'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { SortableTable } from '@mth/components/SortableTable/SortableTable'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { APPLICATION_HEADCELLS } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { getEmailTemplateQuery } from '@mth/graphql/queries/email-template'
import { Application } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../../SiteManagement/services'
import { ApplicationEmailModal } from '../ApplicationModal/ApplicationEmailModal'
import { ApplicationModal } from '../ApplicationModal/ApplicationModal'
import {
  getApplicationsQuery,
  approveApplicationMutation,
  deleteApplicationMutation,
  emailApplicationMutation,
  updateApplicationMutation,
  toggleHideApplicationMutation,
  updateApplicationSchoolYearByIds,
} from '../services'
import { ApplicationTableProps, EmailTemplateVM } from '../type'

export const ApplicationTable: React.FC<ApplicationTableProps> = ({ filter }) => {
  const { me } = useContext(UserContext)
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateVM>()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [seachField, setSearchField] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [noStudnetAlert, setNoStudentAlert] = useState<boolean>(false)
  const [editYearModal, setEditYearModal] = useState<boolean>(false)
  const [clearAll, setClearAll] = useState<boolean>(false)
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState<string>('status|ASC')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [tableData, setTableData] = useState<Array<unknown>>([])
  const [applicationIds, setApplicationIds] = useState<Array<string>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<unknown[]>([])
  const [editData, setEditData] = useState<unknown>()
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [specialEdOptions, setSpecialEdOptions] = useState<string[]>([])
  const [emailHistory, setEmailHistory] = useState([])

  const [applicationList, setApplicationList] = useState<Application[]>([])
  const [emailTemplateSchoolYear, setEmailTemplateSchoolYear] = useState<{
    schoolYearId: null | number
    midYear: null | boolean
  }>({
    schoolYearId: null,
    midYear: null,
  })
  const [selectingError, setSelectingError] = useState<boolean>(false)
  const status = ['New', 'Sibling', 'Returning', 'Hidden']

  const checker = (arr: string[], target: string[]) => target.every((v) => arr.includes(v))

  const createData = (application: unknown) => {
    let grade_level =
      application?.student?.grade_levels &&
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
      year: (
        <Box>
          {application.midyear_application ? (
            <>
              {`${moment(new Date(application.school_year.date_begin)).format('YYYY')}-${moment(
                new Date(application.school_year.date_end),
              ).format('YY')}`}
              <br /> Mid-year
            </>
          ) : (
            <>
              {`${moment(new Date(application.school_year.date_begin)).format('YYYY')}-${moment(
                new Date(application.school_year.date_end),
              ).format('YY')}`}
            </>
          )}
        </Box>
      ),
      student: `${application.student.person?.last_name}, ${application.student.person?.first_name}`,
      grade: grade_level,
      sped:
        specialEdOptions.length == 0
          ? application.student.special_ed
            ? 'Yes'
            : 'No'
          : specialEdOptions[application.student.special_ed],
      parent: `${application.student.parent.person?.last_name}, ${application.student.parent.person?.first_name}`,
      // status: application.status,
      relation: application.relation_status ? status[application.relation_status] : 'New',
      verified: application?.student?.parent?.person?.email_verifier?.verified ? 'Yes' : 'No',
      emailed:
        application.application_emails.length > 0 ? (
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(application)}>
            {moment(application.application_emails[application.application_emails.length - 1].created_at).format(
              'MM/DD/YY',
            )}
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
            onClick={() => handleDelete(application.application_id)}
            sx={{
              borderRadius: 1,
              cursor: 'pointer',
            }}
          >
            <Tooltip title='Delete'>
              <svg width='14' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
                  fill='#323232'
                />
              </svg>
            </Tooltip>
          </Box>
        </Box>
      ),
    }
  }

  // const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearQuery)
  const { data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

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
      schoolYearId: emailTemplateSchoolYear.schoolYearId,
      midYear: emailTemplateSchoolYear.midYear,
    },
    fetchPolicy: 'network-only',
    skip: !emailTemplateSchoolYear.schoolYearId,
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
    if (applicationIds.length > 0) {
      const firstApplication = applicationList.find((app) => app.application_id === applicationIds[0])
      if (
        firstApplication &&
        (emailTemplateSchoolYear.schoolYearId !== firstApplication?.school_year_id ||
          emailTemplateSchoolYear.midYear !== firstApplication?.midyear_application)
      ) {
        setEmailTemplateSchoolYear({
          schoolYearId: firstApplication?.school_year_id,
          midYear: firstApplication?.midyear_application,
        })
      }
    }
  }, [applicationIds])

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  useEffect(() => {
    if (schoolYearData?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.region
      const yearList = []
      let special_ed_options = ''
      SchoolYears.sort((a, b) => (a.date_begin > b.date_begin ? 1 : -1))
        .filter((item) => new Date(item.date_begin) <= new Date() && new Date(item.date_end) >= new Date())
        .map(
          (item: {
            date_begin: string
            date_end: string
            school_year_id: string
            midyear_application: number
            midyear_application_open: string
            midyear_application_close: string
            special_ed_options: string
          }): void => {
            yearList.push({
              label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
              value: item.school_year_id,
            })
            if (item && item.midyear_application === 1) {
              yearList.push({
                label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format(
                  'YY',
                )} Mid-year Program`,
                value: `${item.school_year_id}-mid`,
              })
            }
            if (item.special_ed_options != '' && item.special_ed_options != null && special_ed_options == '')
              special_ed_options = item.special_ed_options
          },
        )
      setSchoolYears(yearList.sort((a, b) => (a.label > b.label ? 1 : -1)))
      if (special_ed_options == '') setSpecialEdOptions([])
      else setSpecialEdOptions(special_ed_options.split(','))
    }
  }, [schoolYearData?.region?.SchoolYears])
  // useEffect(() => {
  //   setSchoolYears(schoolYearData?.schoolYears)
  // }, [schoolLoading])

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
      setApplicationList(results)
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

  const [deleteApplication] = useMutation(deleteApplicationMutation)
  const handleDelete = async (id: string) => {
    await deleteApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: [id],
        },
      },
    })
    setApplicationIds([])
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
    setApplicationIds([])
    refetch()
  }

  const handleApplicationAccept = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true)
      return
    }
    await approveApplicationAction()
  }
  const [approveApplication] = useMutation(approveApplicationMutation)

  const approveApplicationAction = async () => {
    await approveApplication({
      variables: {
        acceptApplicationInput: {
          application_ids: applicationIds,
        },
      },
    })
    refetch()
  }
  const [emailApplication] = useMutation(emailApplicationMutation)

  const onSendEmail = async (from: string, subject: string, body: string) => {
    if (applicationIds.length === 0) {
      return
    }
    try {
      await emailApplication({
        variables: {
          emailApplicationInput: {
            application_ids: applicationIds.map((item) => parseInt(item)),
            from: from,
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
  const handleEmailSend = (from: string, subject: string, body: string) => {
    if (applicationIds.length === 0) {
      return
    }
    onSendEmail(from, subject, body)
  }
  const handleOpenEmailModal = () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true)
    } else {
      let midStatus = true
      let schoolYearWithMid = ''
      applicationIds.map((id) => {
        const application = applicationList.find((app) => app.application_id === id)
        if (!schoolYearWithMid) {
          schoolYearWithMid = application.school_year_id + (application.midyear_application ? '-mid' : '')
        } else {
          if (schoolYearWithMid !== application.school_year_id + (application.midyear_application ? '-mid' : '')) {
            midStatus = false
          }
        }
      })
      // check if selected the same schoolyears
      if (midStatus) {
        setOpen(true)
      } else {
        setSelectingError(true)
      }
    }
  }

  const [updateMiltiSchoolYears] = useMutation(updateApplicationSchoolYearByIds)

  const handleChangeProgramYear = async () => {
    if (applicationIds.length === 0) {
      setNoStudentAlert(true)
      return
    }
    setEditYearModal(true)
  }

  const submitEditYear = async (form) => {
    const { schoolYear } = form
    await updateMiltiSchoolYears({
      variables: {
        updateApplicationSchoolYearInput: {
          application_ids: applicationIds,
          school_year_id: parseInt(schoolYear?.split('-')[0]),
          midyear_application: schoolYear?.split('-')[1] === 'mid' ? 1 : 0,
        },
      },
    })
    setApplicationIds([])
    setClearAll(!clearAll)
    setEditYearModal(false)
    refetch()
  }

  const handleEditApplication = (data) => {
    setEditData({
      ...data,
      school_year_id: data.midyear_application ? data.school_year_id + '-mid' : data.school_year_id,
    })
    setOpenEditModal(true)
  }
  const [updateApplication] = useMutation(updateApplicationMutation)
  const handleSaveApplication = async (data) => {
    await updateApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(data.application_id),
          status: data.status,
          school_year_id: parseInt(String(data.school_year_id)?.split('-')[0]),
          midyear_application: String(data.school_year_id)?.split('-')[1] === 'mid' ? true : false,
        },
      },
    })
    refetch()
    setOpenEditModal(false)
  }
  const [toogleHideApplication] = useMutation(toggleHideApplicationMutation)
  const handleToggleHideApplication = async (application_id, status) => {
    await toogleHideApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(application_id),
          midyear_application: status,
          relation_status: 1,
          school_year_id: 1,
          status: 'status',
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

  const sortChangeAction = (property: string, order: string) => {
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
            justifyContent: 'flex-start',
            marginLeft: '24px',
          }}
        >
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              background: MthColor.RED_GRADIENT,
              color: 'white',
              width: '195px',
              marginRight: 2,
              height: '33px',
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
              minWidth: '160px',
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
              background: MthColor.GREEN_GRADIENT,
              color: 'white',
              width: '195px',
              '&:hover': {
                background: '#33FF7C',
                color: 'fff',
              },
            }}
            onClick={handleChangeProgramYear}
          >
            Change Program Year
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
              background: MthColor.RED_GRADIENT,
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
              background: MthColor.BUTTON_LINEAR_GRADIENT,
              color: 'white',
              marginRight: '12px',
              width: '92px',
            }}
            onClick={handleApplicationAccept}
          >
            Accept
          </Button>
        </Box>
        <Pagination
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil((totalApplications as number) / paginatinLimit) || 0}
          currentPage={currentPage}
        />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={APPLICATION_HEADCELLS}
        onCheck={setApplicationIds}
        onSortChange={sortChangeAction}
        clearAll={clearAll}
      />
      {open && (
        <EmailModal
          handleModem={() => setOpen(!open)}
          title={applicationIds.length + ' Recipient' + (applicationIds.length > 1 ? 's' : '')}
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
      {noStudnetAlert && (
        <WarningModal
          handleModem={() => setNoStudentAlert(!noStudnetAlert)}
          title='Error'
          subtitle='No student(s) selected'
          btntitle='OK'
          handleSubmit={() => setNoStudentAlert(!noStudnetAlert)}
        />
      )}
      {editYearModal && (
        <EditYearModal
          title='Change Program Year'
          schoolYears={schoolYears}
          handleSubmit={submitEditYear}
          handleClose={() => setEditYearModal(false)}
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
          data={emailHistory}
        />
      )}
      {selectingError && (
        <WarningModal
          handleModem={() => setSelectingError(false)}
          title='Error'
          subtitle='You may only select multiple students with the same program year.'
          btntitle='OK'
          handleSubmit={() => setSelectingError(false)}
          textCenter
          modalWidth='460px'
        />
      )}
    </Card>
  )
}
