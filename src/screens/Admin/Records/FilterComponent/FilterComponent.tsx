import React, { useCallback, useContext, useEffect, useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Grid, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, StudentRecordFileKind } from '@mth/enums'
import {
  useEnrollmentPacketDocumentListByRegionId,
  useProgramYearListBySchoolYearId,
  useSchoolPartnerListByRegionIdAndSchoolYearId,
  useSchoolYearsByRegionId,
} from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import {
  DEFAULT_ENROLLMENT_STATUS_FILTER,
  DEFAULT_GRADES_FILTER1,
  DEFAULT_GRADES_FILTER2,
  DEFAULT_OTHER_LIST,
  DEFULAT_ENROLLMENT_STATUS_LIST,
  DEFULAT_PROGRAM_YEAR_STATUS_FILTER,
  DEFULAT_PROGRAM_YEAR_STATUS_LIST,
} from '../defaultValues'
import { recordClasses } from '../styles'
import { FilterComponentProps } from '../types'
import { filterComponentClassess } from './styles'

const FilterComponent: React.FC<FilterComponentProps> = ({ setFilter }) => {
  const { me } = useContext(UserContext)
  const region = me?.userRegion?.filter((item) => item.region_id == me?.selectedRegionId)?.at(-1)
  const [expand, setExpand] = useState<boolean>(true)
  const [grades1, setGrades1] = useState<string[]>([])
  const [grades2, setGrades2] = useState<string[]>([])
  const [programYearStatus, setProgramYearStatus] = useState<string[]>([])
  const [enrollmentStatus, setEnrollmentStatus] = useState<string[]>([])
  const [enrollmentPacketDocument, setEnrollmentPacketDocument] = useState<string[]>([])
  const [other, setOther] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined | null>(null)
  const [endDate, setEndDate] = useState<Date | undefined | null>(null)

  const {
    dropdownItems: schoolYearDropdownItems,
    selectedYearId,
    setSelectedYearId,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  const {
    programYearList,
    programYears,
    setProgramYears,
    gradeList,
    specialEdList,
    selectedSpecialEd: specialEd,
    setSelectedSpecialEd: setSpecialEd,
  } = useProgramYearListBySchoolYearId(selectedYearId)
  const { data: enrollmentPacketDocumentList } = useEnrollmentPacketDocumentListByRegionId(
    Number(me?.selectedRegionId),
    selectedYearId,
  )
  const {
    schoolOfEnrollmentList,
    selectedSchoolofEnrollments: schoolofEnrollment,
    setSelectedSchoolofEnrollments: setSchoolofEnrollment,
  } = useSchoolPartnerListByRegionIdAndSchoolYearId(Number(me?.selectedRegionId), selectedYearId)

  const grade2Options: CheckBoxListVM[] = [
    {
      label: 'Kindergarten',
      value: 'Kindergarten',
    },
    {
      label: '1-8',
      value: '1-8',
    },
    {
      label: '9-12',
      value: '9-12',
    },
  ]

  const chevron = () =>
    !expand ? <ExpandLessIcon sx={recordClasses.expandIcon} /> : <ExpandMoreIcon sx={recordClasses.expandIcon} />

  const jsonStringify = (value: string[]) => {
    if (value?.length > 0) {
      return JSON.stringify(value)
    } else {
      return ''
    }
  }

  const handleGradeFilterChange = useCallback(
    (values: string[], isGrade1Filter: boolean) => {
      let newGrades1: string[] = []
      let newGrades2: string[] = []
      const ONE_TO_EIGHT = ['1', '2', '3', '4', '5', '6', '7', '8']
      const NINE_TO_TWELVE = ['9', '10', '11', '12']
      if (isGrade1Filter) {
        if (values?.includes('Kindergarten')) {
          newGrades2 = ['Kindergarten']
        } else {
          newGrades2 = []
        }

        let oneToEightChecked = true
        let nineToTwelveChecked = true

        ONE_TO_EIGHT.map((item) => {
          if (!values?.includes(item)) oneToEightChecked = false
        })

        NINE_TO_TWELVE.map((item) => {
          if (!values?.includes(item)) nineToTwelveChecked = false
        })

        if (oneToEightChecked) newGrades2.push('1-8')
        if (nineToTwelveChecked) newGrades2.push('9-12')

        setGrades1(values)
        setGrades2(newGrades2)
      } else {
        if (values?.includes('Kindergarten')) {
          newGrades1 = ['Kindergarten']
        } else {
          newGrades1 = []
        }

        const filteredGrades = [...grades1.filter((item) => item !== 'Kindergarten' && item != 'all')]
        let oneToEightChecked = true
        let nineToTwelveChecked = true
        if (values?.includes('1-8')) {
          newGrades1 = newGrades1.concat(ONE_TO_EIGHT)
        } else {
          ONE_TO_EIGHT.map((item) => {
            if (!filteredGrades?.includes(item)) oneToEightChecked = false
          })
        }
        if (!values?.includes('1-8') && oneToEightChecked)
          newGrades1 = [...newGrades1, ...filteredGrades?.filter((item) => !ONE_TO_EIGHT.includes(item))]
        else
          newGrades1 = [
            ...newGrades1,
            ...filteredGrades?.filter((item) => !newGrades1.includes(item) && !NINE_TO_TWELVE.includes(item)),
          ]
        if (values?.includes('9-12')) {
          newGrades1 = newGrades1.concat(NINE_TO_TWELVE)
        } else {
          NINE_TO_TWELVE.map((item) => {
            if (!filteredGrades?.includes(item)) nineToTwelveChecked = false
          })
        }
        if (!values?.includes('9-12') && nineToTwelveChecked)
          newGrades1 = [...newGrades1, ...filteredGrades?.filter((item) => !NINE_TO_TWELVE.includes(item))]
        else
          newGrades1 = [
            ...newGrades1,
            ...filteredGrades?.filter((item) => !newGrades1.includes(item) && !ONE_TO_EIGHT.includes(item)),
          ]

        if (values?.includes('1-8') && values?.includes('9-12') && values?.includes('Kindergarten'))
          newGrades1.push('all')
        setGrades1([...newGrades1])
        setGrades2(values)
      }
    },
    [grades1, grades2, setGrades1, setGrades2],
  )

  const handleFilter = () => {
    setFilter({
      gradeLevel1: jsonStringify(grades1),
      gradeLevel2: jsonStringify(grades2),
      programYear: jsonStringify(programYears),
      programYearStatus: jsonStringify(programYearStatus),
      enrollmentStatus: jsonStringify(enrollmentStatus),
      schoolOfEnrollment: jsonStringify(schoolofEnrollment),
      specialEd: jsonStringify(specialEd),
      EnrollmentPacketDocuments: jsonStringify(enrollmentPacketDocument),
      other: jsonStringify(other),
      dateRange: {
        startDate: startDate,
        endDate: endDate,
      },
      schoolYearId: selectedYearId || 0,
    })
    setExpand(!expand)
  }

  const setDefaultFilter = () => {
    handleGradeFilterChange(DEFAULT_GRADES_FILTER1, true)
    setProgramYearStatus(DEFULAT_PROGRAM_YEAR_STATUS_FILTER)
    setEnrollmentStatus(DEFAULT_ENROLLMENT_STATUS_FILTER)
    setEnrollmentPacketDocument([])
    setOther([])
    setStartDate(null)
    setEndDate(null)
    setFilter({
      gradeLevel1: jsonStringify(DEFAULT_GRADES_FILTER1),
      gradeLevel2: jsonStringify(DEFAULT_GRADES_FILTER2),
      programYear: jsonStringify(programYears),
      programYearStatus: jsonStringify(DEFULAT_PROGRAM_YEAR_STATUS_FILTER),
      enrollmentStatus: jsonStringify(DEFAULT_ENROLLMENT_STATUS_FILTER),
      schoolOfEnrollment: jsonStringify(schoolofEnrollment),
      specialEd: jsonStringify(specialEd),
      EnrollmentPacketDocuments: '',
      other: '',
      dateRange: {
        startDate: null,
        endDate: null,
      },
      schoolYearId: selectedYearId || 0,
    })
  }

  const handleClear = () => {
    setGrades1([])
    setGrades2([])
    setProgramYears([])
    setProgramYearStatus([])
    setEnrollmentStatus([])
    setSchoolofEnrollment([])
    setSpecialEd([])
    setEnrollmentPacketDocument([])
    setOther([])
    setStartDate(null)
    setEndDate(null)
    setFilter({
      gradeLevel1: '',
      gradeLevel2: '',
      programYear: '',
      programYearStatus: '',
      enrollmentStatus: '',
      schoolOfEnrollment: '',
      specialEd: '',
      EnrollmentPacketDocuments: '',
      other: '',
      dateRange: {
        startDate: null,
        endDate: null,
      },
      schoolYearId: selectedYearId || 0,
    })
  }

  useEffect(() => {
    setDefaultFilter()
  }, [selectedYearId, programYears, specialEd, schoolofEnrollment])

  return (
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
        <Subtitle fontWeight='700' color={MthColor.MTHBLUE} sx={{ cursor: 'pointer', fontSize: '20px' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && (
        <>
          <Box sx={recordClasses.dropDownContainer}>
            <DropDown
              dropDownItems={schoolYearDropdownItems}
              placeholder={'Select Year'}
              defaultValue={selectedYearId || 0}
              borderNone={true}
              setParentValue={(val) => {
                setSelectedYearId(+val)
              }}
            />
          </Box>
          <Grid container sx={{ textAlign: 'left' }}>
            <Grid item container xs={12} lg={12}>
              <Grid item xs={12} lg={2}>
                <Box sx={filterComponentClassess.container}>
                  <MthCheckboxList
                    title={'Grade Level'}
                    values={grades1}
                    setValues={(value) => {
                      handleGradeFilterChange(value, true)
                    }}
                    checkboxLists={gradeList}
                    haveSelectAll={true}
                    labelSx={{ fontSize: '14px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={2}>
                <Box sx={filterComponentClassess.container}>
                  <MthCheckboxList
                    title={'Grade Level'}
                    values={grades2}
                    setValues={(value) => {
                      handleGradeFilterChange(value, false)
                    }}
                    checkboxLists={grade2Options}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                  <MthCheckboxList
                    title={'Enrollment Status'}
                    values={enrollmentStatus}
                    setValues={(value) => {
                      setEnrollmentStatus(value)
                    }}
                    checkboxLists={DEFULAT_ENROLLMENT_STATUS_LIST}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                  <MthCheckboxList
                    title={'Program Year'}
                    values={programYears}
                    setValues={(value) => {
                      setProgramYears(value)
                    }}
                    checkboxLists={programYearList}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                  <MthCheckboxList
                    title={'Program Year Status'}
                    values={programYearStatus}
                    setValues={(value) => {
                      setProgramYearStatus(value)
                    }}
                    checkboxLists={DEFULAT_PROGRAM_YEAR_STATUS_LIST}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={2}>
                <Box sx={filterComponentClassess.container}>
                  <MthCheckboxList
                    title={'School of Enrollment'}
                    values={schoolofEnrollment}
                    setValues={(value) => {
                      setSchoolofEnrollment(value)
                    }}
                    checkboxLists={schoolOfEnrollmentList}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                  <MthCheckboxList
                    title={'Special Ed'}
                    values={specialEd}
                    setValues={(value) => {
                      setSpecialEd(value)
                    }}
                    checkboxLists={specialEdList}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Box sx={filterComponentClassess.container}>
                  <Paragraph size='large' fontWeight='700'>
                    {'Files'}
                  </Paragraph>
                  <MthCheckboxList
                    title={'Enrollment Packet Documents'}
                    values={enrollmentPacketDocument}
                    setValues={(value) => {
                      setEnrollmentPacketDocument(value)
                    }}
                    checkboxLists={enrollmentPacketDocumentList}
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                  <MthCheckboxList
                    title={'Other'}
                    values={other}
                    setValues={(value) => {
                      setOther(value)
                    }}
                    checkboxLists={
                      region?.regionDetail?.name == 'Utah'
                        ? DEFAULT_OTHER_LIST
                        : [...DEFAULT_OTHER_LIST.filter((item) => item.label !== StudentRecordFileKind.USIRS)]
                    }
                    haveSelectAll={false}
                    labelSx={{ fontSize: '14px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Paragraph size='large' fontWeight='700'>
                  {'Date Range'}
                </Paragraph>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={recordClasses.dateGroup}>
                    <Box sx={{ display: 'grid' }}>
                      <DatePicker
                        label='Start Date'
                        inputFormat='MM/dd/yyyy'
                        maxDate={endDate ? moment(endDate).toDate() : null}
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e)
                        }}
                        renderInput={(params) => <TextField color='primary' size='small' {...params} />}
                      />
                    </Box>
                    <Box sx={{ display: 'grid' }}>
                      <DatePicker
                        label='End Date'
                        minDate={startDate ? moment(startDate).toDate() : null}
                        inputFormat='MM/dd/yyyy'
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e)
                        }}
                        renderInput={(params) => <TextField color='primary' size='small' {...params} />}
                      />
                    </Box>
                  </Box>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={recordClasses.btnGroup}>
            <Button sx={recordClasses.clearAllBtn} onClick={handleClear}>
              Clear All
            </Button>
            <Button sx={recordClasses.filterBtn} onClick={handleFilter}>
              Filter
            </Button>
          </Box>
        </>
      )}
    </Card>
  )
}

export default FilterComponent
