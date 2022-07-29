import { Box, Button, Card, InputAdornment, OutlinedInput, Tooltip } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT, GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT } from '../../../../utils/constants'
import SearchIcon from '@mui/icons-material/Search'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useQuery, useMutation } from '@apollo/client'
import {
  getApplicationsQuery,
  approveApplicationMutation,
  deleteApplicationMutation,
  GetSchoolsPartner
} from '../services'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import { map, parseInt, sortBy } from 'lodash'
import moment from 'moment'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { APPLICATION_HEADCELLS, ENROLLMENT_SCHOOL_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { EnrollmentSchoolTableProps, EmailTemplateVM, SchoolYearVM } from '../type'
import { EditYearModal } from '../../../../components/EmailModal/EditYearModal'
import { getSchoolYearsByRegionId } from '../../SiteManagement/services'
import { DropDown } from '../../SiteManagement/components/DropDown/DropDown'

export const EnrollmentSchoolTable = ({ filter, setFilter, partnerList }: EnrollmentSchoolTableProps) => {
  const { me } = useContext(UserContext)
  const [studentList, setStudentList] = useState([]);

  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateVM>()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [seachField, setSearchField] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [noStudnetAlert, setNoStudentAlert] = useState<boolean>(false)
  const [clearAll, setClearAll] = useState<boolean>(false)
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState<string>('status|ASC')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [tableData, setTableData] = useState<Array<any>>([])
  const [applicationIds, setApplicationIds] = useState<Array<string>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [schoolYears, setSchoolYears] = useState<any[]>([])
  const [editData, setEditData] = useState<any>()
  const [selectedYear, setSelectedYear] = useState('')
  const [schoolPartner, setSchoolPartner] = useState('')

  const status = ['New', 'Sibling', 'Returning', 'Hidden']
  const createData = (application: any) => {
    return {
      student: `${application.student.person?.last_name}, ${application.student.person?.first_name}`,
      grade:
        application.student.grade_levels.length &&
        (application.student.grade_levels[0].grade_level.includes('Kin')
          ? 'K'
          : application.student.grade_levels[0].grade_level),
      parent: `${application.student.parent.person?.last_name}, ${application.student.parent.person?.first_name}`,


      id: application.application_id,
      submitted: application.date_submitted ? moment(application.date_submitted).format('MM/DD/YY') : null,
      year: (
        <Box>
          {application.midyear_application ? (
            <>
              {/* {`${moment(new Date(application.school_year.midyear_application_open)).format('YYYY')} -
              ${moment(new Date(application.school_year.midyear_application_close)).format('YY')}`} */}
              {`${moment(new Date(application.school_year.date_begin)).format('YYYY')} -
              ${moment(new Date(application.school_year.date_end)).format('YY')}`}
              <br /> Mid-Year
            </>
          ) : (
            <>
              {`${moment(new Date(application.school_year.date_begin)).format('YYYY')} -
              ${moment(new Date(application.school_year.date_end)).format('YY')}`}
            </>
          )}
        </Box>
      ),

      sped: application.student.special_ed ? 'Yes' : 'No',

      // status: application.status,

    }
  }

  // const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearQuery)
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  });

  const { data, refetch } = useQuery(getApplicationsQuery, {
    variables: {
      // filter: filter,
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: seachField,
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  // keep it for future ticket
  // const { data: studentsData, refetch: studentDataRefetch } = useQuery(getStudnets, {
  //   variables: {
  //     filter: {
  //       regionId: me?.selectedRegionId,
  //       search: seachField,
  //     },
  //     skip: skip,
  //     sort: sort,
  //     take: paginatinLimit,
  //   },
  //   skip: me?.selectedRegionId ? false : true,
  //   fetchPolicy: 'network-only',
  // })

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
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])


  useEffect(() => {
    if (schoolYearData?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.region;
      let yearList = [];
      SchoolYears.sort((a, b) => a.date_begin > b.date_begin ? 1 : -1).map((item: any) => {
        yearList.push({
          value: item.school_year_id,
          label: moment(item.date_begin).format('YYYY') + ' - ' + moment(item.date_end).format('YY'),
        });
        if (item.midyear_application === 1) {
          yearList.push({
            value: -1 * item.school_year_id,
            label: moment(item.date_begin).format('YYYY') + ' - ' + moment(item.date_end).format('YY') + ' Mid-Year',
          });
        }
      });
      setSchoolYears(yearList)
      setSelectedYear(yearList[0]?.value)
      setFilter(prev => ({
        ...prev,
        schoolYear: yearList[0]?.label
      }))
    }
  }, [schoolYearData?.region?.SchoolYears]);
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
            Students
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalApplications}
          </Subtitle>
          <Box marginLeft={4}>
            <OutlinedInput
              sx={{
                width: '280px'
              }}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={seachField}
              placeholder='Search...'
              onChange={(e) => {
                handlePageChange(1), setSearchField(e.target.value)
              }}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'left',
          marginTop: '50px',
          justifyContent: 'space-between'
        }}
      >
        <Box display='flex' flexDirection='row' justifyContent='flex-end' sx={{ mr: 3 }} alignItems='center'>
          <DropDown
            dropDownItems={schoolYears}
            placeholder={'Select Year'}
            defaultValue={selectedYear}
            sx={{ width: '200px', marginLeft: '24px' }}
            borderNone={true}
            size="small"
            setParentValue={(val) => {
              setSelectedYear(val);
              const yearLabel = schoolYears.find(item => item.value == val);
              setFilter(prevState => ({
                ...prevState,
                schoolYear: yearLabel?.label
              }))
            }}
          />

          <DropDown
            dropDownItems={partnerList}
            alternate={true}
            placeholder={'Select'}
            defaultValue={schoolPartner}
            sx={{ widtH: '200px' }}
            size='small'
            setParentValue={(val) => {
              setSchoolPartner(val)
            }}
          />

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
                width: '92px',
                padding: '20px 55px',
                marginBottom: '4px'
              }}
              // onClick={handleApplicationAccept}
            >
              Assign
            </Button>
          </Box>

          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'left',
              justifyContent: 'flex-end',
              marginLeft: '24px'
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
                padding: '20px 55px',
                marginBottom: '4px'
              }}
              // onClick={handleDeleteSelected}
            >
              Transfer
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
          <Pagination
            setParentLimit={handleChangePageLimit}
            handlePageChange={handlePageChange}
            defaultValue={paginatinLimit || 25}
            numPages={Math.ceil((totalApplications as number) / paginatinLimit) || 0}
            currentPage={currentPage}
          />
        </Box>
      </Box>

      <SortableTable
        rows={tableData}
        headCells={ENROLLMENT_SCHOOL_HEADCELLS}
        onCheck={setApplicationIds}
        onSortChange={sortChangeAction}
        clearAll={clearAll}
      />
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
    </Card>
  )
}
