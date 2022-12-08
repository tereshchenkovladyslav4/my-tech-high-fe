import React, { useEffect, useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput, Tooltip } from '@mui/material'
import { toString } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Pagination } from '@mth/components/Pagination/Pagination'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field, ValueOf } from '@mth/components/Table/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { BLUE_GRDIENT, RED_GRADIENT } from '../../../../../utils/constants'
import { assignStudentToSOEGql } from '../../../SiteManagement/services'
import { getStudents } from '../services'
import { useStyles } from '../styles'
import { EnrollmentSchoolTableProps, YEAR_STATUS, StudentVM } from '../type'
export const AssignmentTable: React.FC<EnrollmentSchoolTableProps> = ({
  filter,
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
        schoolYear: parseInt(selectedYear?.value as string),
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

  const handleChangePageLimit = (value: number) => {
    localStorage.setItem('pageLimit', `${value}`)
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
          school_partner_id: schoolPartner !== 'unassigned' ? parseInt(schoolPartner) : -1,
          school_year_id: parseInt(selectedYear?.value as string),
          student_ids: studentIds.map((item) => parseInt(item as string)),
        },
      },
    })
    setSchoolPartner('')
    setItems([])
    refetch()
  }

  const handleTransfer = () => {
    if (!validAssignOrTransfer()) return
  }

  const fields: Field<StudentVM>[] = useMemo(() => {
    const current_Label = selectedYear?.label ? toString(selectedYear.label).split('Mid-year')[0] : ''
    const previous_Label = previousYear
      ? moment(previousYear.date_begin).format('YYYY') + '-' + moment(previousYear.date_end).format('YY')
      : null
    const fieldItems: Field<StudentVM>[] = [
      {
        key: 'student',
        label: 'Student',
        sortable: true,
        tdClass: 'fw-400',
        formatter: (student) => {
          return `${student.person?.last_name}, ${student.person?.first_name}`
        },
      },
      {
        key: 'grade',
        label: 'Grade',
        sortable: true,
        tdClass: 'fw-400',
        formatter: (student) => {
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
        tdClass: 'fw-400',
        formatter: (student) => {
          return student.parent?.person?.address?.city
        },
      },
      {
        key: 'parent',
        label: 'Parent',
        sortable: true,
        tdClass: 'fw-400',
        formatter: (parent) => {
          return `${parent?.person?.last_name}, ${parent?.person?.first_name}`
        },
      },
      {
        key: 'currentSoe',
        label: current_Label,
        sortable: true,
        tdClass: 'fw-400',
        formatter: (item) => {
          return item.currentSoe?.[0]?.partner?.abbreviation || 'Unassigned'
        },
      },
    ]
    if (previous_Label) {
      fieldItems.push({
        key: 'previousSoe',
        label: previous_Label,
        sortable: true,
        tdClass: 'fw-400',
        formatter: (student) => {
          return student.previousSoe?.[0]?.partner?.abbreviation || 'Unassigned'
        },
      })
    }
    return fieldItems
  }, [groupGrades, previousYear])

  const rowGroupBy: keyof StudentVM | undefined = useMemo(() => {
    return filter?.yearStatus?.includes(YEAR_STATUS.SIBLING) ? ('parent_id' as keyof StudentVM) : undefined
  }, [filter?.yearStatus])

  const classes = useStyles()
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
          marginTop: '50px',
          marginBottom: 4,
        }}
      >
        <Box className={classes.root} sx={{ marginLeft: '-16px' }}>
          <DropDown
            dropDownItems={schoolYears}
            placeholder={'Select Year'}
            defaultValue={selectedYear?.value || ''}
            borderNone={true}
            sx={{ width: '150px' }}
            size='small'
            setParentValue={(val) => {
              const selYear = schoolYears.find((item) => item.value == val)
              if (selYear) setSelectedYear(selYear)
            }}
          />

          <DropDown
            dropDownItems={[]}
            alternate={true}
            placeholder={'Select'}
            defaultValue={''}
            sx={{ width: '50%' }}
            size='small'
            setParentValue={(val) => {
              setSchoolPartner(val as string)
            }}
          />

          <Tooltip title='Assign School of Enrollment' placement='top'>
            <Button
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 29,
                color: 'white',
                background: BLUE_GRDIENT,
                '&:hover': {
                  background: BLUE_GRDIENT,
                },
              }}
              onClick={handleAssignStudentToSOE}
              className='btn-action'
            >
              Assign
            </Button>
          </Tooltip>

          <Tooltip title='Create withdraw form from previous SoE' placement='top'>
            <Button
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 29,
                color: 'white',
                background: RED_GRADIENT,
                '&:hover': {
                  background: '#D23C33',
                  color: '#fff',
                },
              }}
              className='btn-action'
              onClick={handleTransfer}
            >
              Transfer
            </Button>
          </Tooltip>

          {/*  Pagination & Actions */}
          <Box
            sx={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pagination
              setParentLimit={handleChangePageLimit}
              handlePageChange={handlePageChange}
              defaultValue={paginationLimit || 25}
              numPages={Math.ceil((totalApplications as number) / paginationLimit) || 1}
              currentPage={currentPage}
            />
          </Box>
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
