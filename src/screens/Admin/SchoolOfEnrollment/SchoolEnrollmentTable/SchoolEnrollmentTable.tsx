import React, { useEffect, useState, FunctionComponent, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'

import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { BUTTON_LINEAR_GRADIENT, RED_GRADIENT } from '../../../../utils/constants'
import { ENROLLMENT_SCHOOL_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { DropDown } from '../../SiteManagement/components/DropDown/DropDown'
import { assignStudentToSOEGql } from '../../SiteManagement/services'
import { getStudents } from '../services'
import { EnrollmentSchoolTableProps, StudentVM } from '../type'

export const EnrollmentSchoolTable: FunctionComponent<EnrollmentSchoolTableProps> = ({
  filter,
  partnerList,
  schoolYears,
  selectedYear,
  setSelectedYear,
  previousYear,
}) => {
  const { me } = useContext(UserContext)

  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [seachField, setSearchField] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [noStudnetAlert, setNoStudentAlert] = useState<boolean>(false)
  const [clearAll, setClearAll] = useState<boolean>(false)
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState<string>('student|ASC')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [tableData, setTableData] = useState<Array<StudentVM>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [schoolPartner, setSchoolPartner] = useState('')
  const [studentIds, setStudentIds] = useState<number[]>([])

  const [assignStudentToSOE] = useMutation(assignStudentToSOEGql)

  useEffect(() => {
    setSearchField('')
  }, [me?.selectedRegionId, selectedYear])

  const createData = (student: StudentVM) => {
    const grade_level = student.grade_levels?.find((item) => item.school_year_id == selectedYear?.value)
    const result = {
      student: `${student.person?.last_name}, ${student.person?.first_name}`,
      grade: grade_level && (grade_level.grade_level.includes('Kin') ? 'K' : grade_level.grade_level),
      id: student.student_id,
      city: student.parent.person?.address?.city,
      parent: `${student.parent.person?.last_name}, ${student.parent.person?.first_name}`,
      currentSOE:
        student.currentSoe && student.currentSoe.length > 0 ? student.currentSoe[0].partner?.name : 'unassign',
      previousSOE:
        student.previousSoe && student.previousSoe.length > 0 ? student.previousSoe[0].partner?.name : 'unassign',
    }
    if (!previousYear) {
      delete result['previousSOE']
    }
    return result
  }

  const { data, refetch } = useQuery(getStudents, {
    variables: {
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: seachField,
      filter: {
        schoolYear: parseInt(selectedYear?.value),
      },
    },
    skip: selectedYear ? false : true,
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
    if (pageLoading) {
      setSkip(0)
      setCurrentPage(1)
    }
  }, [filter])

  useEffect(() => {
    if (data !== undefined) {
      setPageLoading(true)
      const { studentsForSOE } = data
      const { results, total } = studentsForSOE

      setTableData(() => {
        return map(results, (student) => {
          return createData(student)
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

  const handleChangePageLimit = (value) => {
    localStorage.setItem('pageLimit', value)
    handlePageChange(1)
    setPaginatinLimit(value)
  }

  const sortChangeAction = (property, order) => {
    setSort(`${property}|${order}`)
  }

  const handleAssignStudentToSOE = async () => {
    await assignStudentToSOE({
      variables: {
        assignStudentToSoeInput: {
          school_partner_id: parseInt(schoolPartner),
          school_year_id: parseInt(selectedYear?.value),
          student_ids: studentIds.map((item) => parseInt(item)),
        },
      },
    })
    setClearAll(!clearAll)
    setSchoolPartner('')
    refetch()
  }

  const headCells = (initialCells) => {
    initialCells.map((item) => {
      if (item.id === 'currentSOE') {
        item.label = selectedYear?.label?.split('Mid-year')[0] + ' SoE'
      }
    })
    if (previousYear) {
      initialCells.map((item) => {
        if (item.id === 'previousSOE') {
          item.label =
            moment(previousYear.date_begin).format('YYYY') + ' - ' + moment(previousYear.date_end).format('YY') + ' SoE'
        }
      })
    } else {
      return initialCells.filter((item) => item.id !== 'previousSOE')
    }
    return initialCells
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
                width: '280px',
              }}
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
      </Box>
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'left',
          marginTop: '50px',
          justifyContent: 'space-between',
        }}
      >
        <Box display='flex' flexDirection='row' justifyContent='flex-end' sx={{ mr: 3 }} alignItems='center'>
          <DropDown
            dropDownItems={schoolYears}
            placeholder={'Select Year'}
            defaultValue={selectedYear?.value || ''}
            sx={{ width: '200px', marginLeft: '24px' }}
            borderNone={true}
            size='small'
            setParentValue={(val) => {
              const selYear = schoolYears.find((item) => item.value == val)
              setSelectedYear(selYear)
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
                marginBottom: '4px',
              }}
              onClick={handleAssignStudentToSOE}
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
                padding: '20px 55px',
                marginBottom: '4px',
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
        headCells={headCells(ENROLLMENT_SCHOOL_HEADCELLS)}
        onSortChange={sortChangeAction}
        clearAll={clearAll}
        onCheck={setStudentIds}
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
