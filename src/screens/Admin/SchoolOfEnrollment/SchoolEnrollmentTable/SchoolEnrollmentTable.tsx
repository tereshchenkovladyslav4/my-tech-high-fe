import React, { useEffect, useState, useMemo, FunctionComponent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput, Tooltip } from '@mui/material'
import { toString } from 'lodash'
import moment from 'moment'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field, ValueOf } from '@mth/components/Table/types'
import { Pagination } from '../../../../components/Pagination/Pagination'

import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { BUTTON_LINEAR_GRADIENT, RED_GRADIENT } from '../../../../utils/constants'
import { DropDown } from '../../SiteManagement/components/DropDown/DropDown'
import { assignStudentToSOEGql } from '../../SiteManagement/services'
import { getStudents } from '../services'
import { EnrollmentSchoolTableProps, YEAR_STATUS, StudentVM, Person, Parent } from '../type'

export const EnrollmentSchoolTable: FunctionComponent<EnrollmentSchoolTableProps> = ({
  filter,
  partnerList,
  schoolYears,
  selectedYear,
  setSelectedYear,
  previousYear,
}) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [searchField, setSearchField] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [noStudentAlert, setNoStudentAlert] = useState<boolean>(false)
  const [paginationLimit, setPaginationLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sortField, setSortField] = useState<string>('student')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [items, setItems] = useState<Array<StudentVM>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [schoolPartner, setSchoolPartner] = useState('')
  const [studentIds, setStudentIds] = useState<Array<ValueOf<StudentVM>>>([])

  const [assignStudentToSOE] = useMutation(assignStudentToSOEGql)

  const groupGrades = useMemo(() => {
    if (filter?.grades) {
      return filter.grades.filter((el) => ['K', '1-8', '9-12'].includes(el))
    } else return []
  }, [filter])

  const { data, refetch, loading } = useQuery(getStudents, {
    variables: {
      skip,
      sort: `${sortField}|${sortOrder}`,
      take: paginationLimit,
      search: searchField,
      filter: {
        ...filter,
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
      return paginationLimit ? paginationLimit * (page - 1) : 25
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
      setItems(results)
      setTotalApplications(total)
    }
  }, [data])

  useEffect(() => {
    if (localStorage.getItem('currentPage')) {
      handlePageChange(Number(localStorage.getItem('currentPage')))
    }
    if (localStorage.getItem('pageLimit')) {
      setPaginationLimit(Number(localStorage.getItem('pageLimit')))
    }
    return () => {
      localStorage.removeItem('currentPage')
      localStorage.removeItem('pageLimit')
    }
  }, [])

  const handleChangePageLimit = (value) => {
    localStorage.setItem('pageLimit', value)
    handlePageChange(1)
    setPaginationLimit(value)
  }

  const sortChangeAction = (property: string, order: 'desc' | 'asc') => {
    setSortField(property)
    setSortOrder(order)
  }

  const validAssignOrTransfer = () => {
    let msg = ''
    if (!studentIds.length) {
      msg = 'No student(s) selected'
    } else if (!schoolPartner) {
      msg = 'No School of Enrollment selected'
    }
    if (msg) {
      setMessage(msg)
      setOpen(true)
    }
    return !msg
  }

  const handleAssignStudentToSOE = async () => {
    if (!validAssignOrTransfer()) return
    await assignStudentToSOE({
      variables: {
        assignStudentToSoeInput: {
          school_partner_id: parseInt(schoolPartner),
          school_year_id: parseInt(selectedYear?.value),
          student_ids: studentIds.map((item) => parseInt(item)),
        },
      },
    })
    setSchoolPartner('')
    refetch()
  }

  const handleTransfer = () => {
    if (!validAssignOrTransfer()) return
  }

  const fields: Field<StudentVM>[] = useMemo(() => {
    const currentSOE_Label = selectedYear?.label ? toString(selectedYear.label).split('Mid-year')[0] + ' SoE' : ''
    const previousSOE_Label = previousYear
      ? moment(previousYear.date_begin).format('YYYY') + ' - ' + moment(previousYear.date_end).format('YY') + ' SoE'
      : null
    const fieldItems: Field<StudentVM>[] = [
      {
        key: 'student',
        label: 'Student',
        sortable: true,
        tdClass: 'fw-700',
        formatter: (_: ValueOf<StudentVM>, student: StudentVM) => {
          return `${student.person?.last_name}, ${student.person?.first_name}`
        },
      },
      {
        key: 'grade',
        label: 'Grade',
        sortable: true,
        tdClass: 'fw-700',
        formatter: (_: ValueOf<StudentVM>, student: StudentVM) => {
          const grade_level = student.grade_levels?.find((item) => item.school_year_id == selectedYear?.value)
          let grade = grade_level && (grade_level.grade_level?.includes('Kin') ? 'K' : grade_level.grade_level)
          // group grade K, 1-8, 9-10
          if (groupGrades.length === 3) {
            if (grade !== 'K') {
              const gradeNumber = Number(grade)
              if (gradeNumber > 0 && gradeNumber < 9) {
                if (groupGrades.includes('1-8')) grade = '1-8'
              } else if (groupGrades.includes('9-12')) grade = '9-12'
            }
          }
          return grade
        },
      },
      {
        key: 'city',
        label: 'City',
        sortable: true,
        tdClass: 'fw-700',
        formatter: (_: ValueOf<StudentVM>, student: StudentVM) => {
          return student.parent?.person?.address?.city
        },
      },
      {
        key: 'parent',
        label: 'Parent',
        sortable: true,
        tdClass: 'fw-700',
        formatter: (parent: ValueOf<StudentVM>) => {
          parent = parent as Parent
          return `${parent?.person?.last_name}, ${parent?.person?.first_name}`
        },
      },
      {
        key: 'currentSoe',
        label: currentSOE_Label,
        sortable: true,
        tdClass: 'fw-700',
        formatter: (currentSoe: ValueOf<StudentVM>) => {
          currentSoe = currentSoe as Person[]
          return currentSoe?.[0]?.partner?.name || 'Unassigned'
        },
      },
    ]
    if (previousSOE_Label) {
      fieldItems.push({
        key: 'previousSoe',
        label: previousSOE_Label,
        sortable: true,
        tdClass: 'fw-700',
        formatter: (previousSoe: ValueOf<StudentVM>) => {
          previousSoe = previousSoe as Person[]
          return previousSoe?.[0]?.partner?.name || 'Unassigned'
        },
      })
    }
    return fieldItems
  }, [groupGrades, previousYear])

  const rowGroupBy: keyof StudentVM | undefined = useMemo(() => {
    return filter?.yearStatus?.includes(YEAR_STATUS.SIBLING) ? ('parent_id' as keyof StudentVM) : undefined
  }, [filter?.yearStatus])

  return (
    <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: 5, px: 3 }}>
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
            sx={{ width: '200px' }}
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
            <Tooltip title='Assign School of Enrollment' placement='top'>
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
            </Tooltip>
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
            <Tooltip title='Create withdraw form from previous SoE' placement='top'>
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
                onClick={handleTransfer}
              >
                Transfer
              </Button>
            </Tooltip>
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
            defaultValue={paginationLimit || 25}
            numPages={Math.ceil((totalApplications as number) / paginationLimit) || 0}
            currentPage={currentPage}
          />
        </Box>
      </Box>
      <Box sx={{ mx: '-14px' }}>
        <CustomTable
          items={items}
          fields={fields}
          orderBy={sortField}
          order={sortOrder}
          checkable
          onSort={sortChangeAction}
          checkKey='student_id'
          checked={studentIds}
          handleCheck={(ids) => setStudentIds(ids)}
          rowGroupBy={rowGroupBy}
          loading={loading}
          borderedBottom
          size='sm'
        />
      </Box>
      {openAlert && (
        <WarningModal
          handleModem={() => setOpenAlert(!openAlert)}
          title='Warning'
          subtitle='Please select applications'
          btntitle='Close'
          handleSubmit={() => setOpenAlert(!openAlert)}
        />
      )}
      {noStudentAlert && (
        <WarningModal
          handleModem={() => setNoStudentAlert(!noStudentAlert)}
          title='Error'
          subtitle='No student(s) selected'
          btntitle='OK'
          handleSubmit={() => setNoStudentAlert(!noStudentAlert)}
        />
      )}
      {open && (
        <WarningModal
          handleModem={() => setOpen(!open)}
          title='Error'
          subtitle={message}
          btntitle='Ok'
          handleSubmit={() => setOpen(!open)}
        />
      )}
    </Card>
  )
}
