import React, { useEffect, useState, useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { toString } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Pagination } from '@mth/components/Pagination/Pagination'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field, ValueOf } from '@mth/components/Table/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { AssignmentStatus, MthColor } from '@mth/enums'
import {
  assignStudentsToHomeroomMutation,
  getStudentsForHoomroom,
  transferStudentsToHomeroomMutation,
} from '../services'
import { assignmentStyle } from '../styles'
import { EnrollmentSchoolTableProps, YEAR_STATUS, StudentVM, OptionType } from '../type'
export const AssignmentTable: React.FC<EnrollmentSchoolTableProps> = ({
  filter,
  schoolYears,
  selectedYear,
  setSelectedYear,
  previousYear,
  currentHomeroomes,
}) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [searchField, setSearchField] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [noStudentAlert, setNoStudentAlert] = useState<boolean>(false)
  const [paginationLimit, setPaginationLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sortField, setSortField] = useState<string>('student')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [skip, setSkip] = useState<number>(0)
  const [totalApplications, setTotalApplications] = useState<number>()
  const [items, setItems] = useState<Array<StudentVM>>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [studentIds, setStudentIds] = useState<Array<ValueOf<StudentVM>>>([])
  const [selectedHomeroom, setSelHomeroom] = useState<OptionType | null>(null)
  const [assignError, setAssignError] = useState<boolean>(false)
  const [autoGradeModal, setAutoGradeModal] = useState<boolean>(false)
  const [autoGrade, setAutoGrade] = useState<string>('')
  const [warningError, setWarningError] = useState<boolean>(false)
  const [isTransferAssignError, setIsTransferAssignError] = useState<boolean>(false)
  const [transferConfirmModal, setTransferConfirmModal] = useState<boolean>(false)
  const [errorHomeroom, setErrorHomeroom] = useState<boolean>(false)
  const [errorStudentSelect, setErrorStudentSelect] = useState<boolean>(false)
  const [submitType, setSubmitType] = useState<string>('')

  const groupGrades = useMemo(() => {
    if (filter?.grades) {
      return filter.grades.filter((el) => ['K', '1-8', '9-12'].includes(el))
    } else return []
  }, [filter])

  const { data, loading, refetch } = useQuery(getStudentsForHoomroom, {
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
      const { studentsForHoomeroom } = data
      const { results, total } = studentsForHoomeroom
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
        formatter: ({ parent }) => {
          return `${parent?.person?.last_name}, ${parent?.person?.first_name}`
        },
      },
      {
        key: 'currentHomeroom',
        label: current_Label,
        sortable: true,
        tdClass: 'fw-400',
        formatter: (studednt) => {
          return studednt.currentHomeroom?.Class?.class_name || AssignmentStatus.UNASSIGNED
        },
      },
    ]
    if (previous_Label) {
      fieldItems.push({
        key: 'previousHomeroom',
        label: previous_Label,
        sortable: true,
        tdClass: 'fw-400',
        formatter: (studednt) => {
          return studednt.previousHomeroom?.Class?.class_name || AssignmentStatus.UNASSIGNED
        },
      })
    }
    return fieldItems
  }, [groupGrades, previousYear])

  const rowGroupBy: keyof StudentVM | undefined = useMemo(() => {
    return filter?.yearStatus?.includes(YEAR_STATUS.FAMILIES) ? ('parent_id' as keyof StudentVM) : undefined
  }, [filter?.yearStatus])

  const classes = assignmentStyle()

  const handleListItemClick = (homeroom: OptionType) => {
    setSelHomeroom(homeroom)
  }

  const [assignStudentsToHomeroom] = useMutation(assignStudentsToHomeroomMutation)

  const submitAssignStudent = async (autoGrade: string | null) => {
    const students = studentIds.map((i) => parseInt(i))
    await assignStudentsToHomeroom({
      variables: {
        homeroomStudentInput: {
          school_year_id: parseInt(selectedYear?.value as string),
          studentIds: students,
          class_id: parseInt(
            selectedHomeroom?.value !== AssignmentStatus.UNASSIGN.toLocaleLowerCase() ? selectedHomeroom?.value : -1,
          ),
          auto_grade: autoGrade,
        },
      },
    })
    refetch()
    setStudentIds([])
    setSelHomeroom(null)
    setAutoGrade('')
  }

  const [transferStudentsToHomeroomSubmit] = useMutation(transferStudentsToHomeroomMutation)

  const submitTransferStudent = async (autoGrade: string | null) => {
    // due date
    if (selectedHomeroom?.dueStatus && !autoGrade) {
      setAutoGradeModal(true)
      setSubmitType('transfer')
      return
    }

    const students = studentIds.map((i) => parseInt(i))
    await transferStudentsToHomeroomSubmit({
      variables: {
        homeroomStudentInput: {
          school_year_id: parseInt(selectedYear?.value as string),
          studentIds: students,
          class_id: parseInt(
            selectedHomeroom?.value !== AssignmentStatus.UNASSIGN.toLocaleLowerCase() ? selectedHomeroom?.value : -1,
          ),
          auto_grade: autoGrade,
        },
      },
    })
    setAutoGrade('')

    await refetch()
    setStudentIds([])
    setSelHomeroom(null)
  }

  const handleAssign = async () => {
    if (studentIds.length === 0) {
      setErrorStudentSelect(true)
      return
    }
    if (!selectedHomeroom) {
      setErrorHomeroom(true)
      return
    }

    if (studentIds.length > 0 && selectedHomeroom?.value) {
      // not unassigned
      if (selectedHomeroom?.value !== AssignmentStatus.UNASSIGN.toLocaleLowerCase()) {
        for (let i = 0; i < studentIds.length; i++) {
          const student = items.find((q) => q.student_id == studentIds[i])
          if (student?.currentHomeroom?.Class) {
            setAssignError(true)
            return
          }
        }
      }

      // due date
      if (selectedHomeroom?.dueStatus) {
        setAutoGradeModal(true)
        setSubmitType('assign')
      } else {
        await submitAssignStudent('')
      }
    }
  }

  const handleTransfer = async () => {
    if (studentIds.length === 0) {
      setErrorStudentSelect(true)
      return
    }
    if (!selectedHomeroom) {
      setErrorHomeroom(true)
      return
    }
    if (studentIds.length > 0 && selectedHomeroom?.value) {
      for (let i = 0; i < studentIds.length; i++) {
        const student = items.find((q) => q.student_id == studentIds[i])
        if (!student?.currentHomeroom?.Class) {
          setIsTransferAssignError(true)
          return
        } else if (student?.currentHomeroom?.Class.class_id !== selectedHomeroom.value) {
          setTransferConfirmModal(true)
          return
        } else if (selectedHomeroom?.dueStatus) {
          setAutoGradeModal(true)
          setSubmitType('transfer')
          return
        }
      }
    }
  }

  const handleSubmitAutoGrade = async () => {
    if (!autoGrade) {
      setWarningError(true)
      return
    }
    setWarningError(false)

    if (submitType === 'transfer') {
      await submitTransferStudent(autoGrade)
    } else {
      await submitAssignStudent(autoGrade)
    }
    setAutoGradeModal(false)
  }

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
          <Box sx={{ flexGrow: 1 }}>
            <Autocomplete
              options={[
                {
                  value: AssignmentStatus.UNASSIGN.toLocaleLowerCase(),
                  label: AssignmentStatus.UNASSIGN,
                },
                ...currentHomeroomes.filter(
                  (item) => !['all', AssignmentStatus.UNASSIGNED.toLocaleLowerCase()].includes(item.value),
                ),
              ]}
              onChange={(event, value) => handleListItemClick(value)}
              sx={{ width: 250 }}
              value={selectedHomeroom}
              id='controlled-demo'
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder='Search...'
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                />
              )}
            />
          </Box>

          <Button
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              height: 29,
              color: 'white',
              background: MthColor.BLUE_GRADIENT,
              '&:hover': {
                background: MthColor.BLUE_GRADIENT,
              },
            }}
            className='btn-action'
            onClick={handleAssign}
            type='button'
          >
            Assign
          </Button>

          <Button
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              height: 29,
              color: 'white',
              background: MthColor.RED_GRADIENT,
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
      {assignError && (
        <WarningModal
          title='Error'
          subtitle='This student(s) has already been assigned to a Homeroom. Please transfer the student instead.'
          btntitle='Ok'
          handleSubmit={() => setAssignError(false)}
          textCenter
        />
      )}
      {autoGradeModal && (
        <WarningModal
          title='Assign'
          subtitle='This Homeroom has Learning Logs past their due date. How would you like to proceed?'
          btntitle='Assign'
          canceltitle='Cancel'
          handleModem={() => {
            setAutoGradeModal(false)
            setWarningError(false)
            setAutoGrade('')
          }}
          handleSubmit={() => handleSubmitAutoGrade()}
          textCenter
          modalWidth='500px'
          error={warningError && !autoGrade}
        >
          <Box sx={{ marginTop: '30px', overflow: 'auto', width: '100%', textAlign: 'start' }}>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={autoGrade}
                onChange={(e) => setAutoGrade(e.target.value)}
              >
                <FormControlLabel
                  value='N/A'
                  control={<Radio sx={{ marginRight: '20px' }} />}
                  label={
                    <Paragraph size='large' fontWeight='600'>
                      Automatically mark the past-due Learning Logs as N/A
                    </Paragraph>
                  }
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={autoGrade}
                onChange={(e) => setAutoGrade(e.target.value)}
              >
                <FormControlLabel
                  value='0'
                  control={<Radio sx={{ marginRight: '20px' }} />}
                  label={
                    <Paragraph size='large' fontWeight='600'>
                      Auto-grade the past-due Learning Logs as 0, requiring the student to submit
                    </Paragraph>
                  }
                />
              </RadioGroup>
            </FormControl>
            {warningError && !autoGrade && (
              <Paragraph size={'large'} fontWeight='600' color={MthColor.RED}>
                Required
              </Paragraph>
            )}
          </Box>
        </WarningModal>
      )}
      {isTransferAssignError && (
        <WarningModal
          title='Error'
          subtitle='This student(s) has not been assigned to a Homeroom. Please assign the student instead.'
          btntitle='Ok'
          handleModem={() => {
            setIsTransferAssignError(false)
          }}
          handleSubmit={() => setIsTransferAssignError(false)}
          textCenter
        />
      )}
      {transferConfirmModal && (
        <WarningModal
          title='Transfer'
          subtitle=''
          btntitle='Transfer'
          handleModem={() => {
            setTransferConfirmModal(false)
          }}
          handleSubmit={() => {
            setTransferConfirmModal(false)
            submitTransferStudent('')
          }}
          textCenter
          modalWidth='480px'
          canceltitle='Cancel'
        >
          <Paragraph size='large' fontWeight='600' sx={{ textAlign: 'center' }}>
            The current Learning Logs do not match the new Learning Logs.
          </Paragraph>
          <Paragraph size='large' fontWeight='600' sx={{ textAlign: 'center', marginTop: '25px' }}>
            Transferring will erase all Learning Log history for the student. Would you still like to transfer the
            student?
          </Paragraph>
        </WarningModal>
      )}

      {errorHomeroom && (
        <WarningModal
          title='Error'
          subtitle='No Homeroom selected'
          btntitle='Ok'
          handleModem={() => {
            setErrorHomeroom(false)
          }}
          handleSubmit={() => setErrorHomeroom(false)}
          textCenter
        />
      )}
      {errorStudentSelect && (
        <WarningModal
          title='Error'
          subtitle='No student(s) selected'
          btntitle='Ok'
          handleModem={() => {
            setErrorStudentSelect(false)
          }}
          handleSubmit={() => setErrorStudentSelect(false)}
          textCenter
        />
      )}
    </Card>
  )
}
