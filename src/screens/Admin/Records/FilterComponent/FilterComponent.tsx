import React, { useContext, useEffect, useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Grid, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
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
import { defaultOtherOptions, defaultStatusOptions } from '../defaultValues'
import { recordClasses } from '../styles'
import { FilterComponentProps } from '../types'
import { filterComponentClassess } from './styles'

const FilterComponent: React.FC<FilterComponentProps> = ({ setFilter }) => {
  const { me } = useContext(UserContext)
  const region = me?.userRegion?.filter((item) => item.region_id == me?.selectedRegionId)?.at(-1)
  const [expand, setExpand] = useState<boolean>(true)
  const [grades1, setGrades1] = useState<string[]>([])
  const [grades2, setGrades2] = useState<string[]>([])
  const [programYears, setProgramYears] = useState<string[]>([])
  const [status, setStatus] = useState<string[]>([])
  const [schoolofEnrollment, setSchoolofEnrollment] = useState<string[]>([])
  const [speicalEd, setSpecialEd] = useState<string[]>([])
  const [enrollmentPacketDocument, setEnrollmentPacketDocument] = useState<string[]>([])
  const [other, setOther] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined | null>(null)
  const [endDate, setEndDate] = useState<Date | undefined | null>(null)
  const {
    dropdownItems: schoolYearDropdownItems,
    selectedYearId,
    setSelectedYearId,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)
  const { programYearList, gradeList, specialEdList } = useProgramYearListBySchoolYearId(selectedYearId)
  const { data: enrollmentPacketDocumentList } = useEnrollmentPacketDocumentListByRegionId(Number(me?.selectedRegionId))
  const { schoolOfEnrollmentList } = useSchoolPartnerListByRegionIdAndSchoolYearId(
    Number(me?.selectedRegionId),
    selectedYearId,
  )

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
  const handleFilter = () => {
    setFilter({
      gradeLevel1: jsonStringify(grades1),
      gradeLevel2: jsonStringify(grades2),
      programYear: jsonStringify(programYears),
      status: jsonStringify(status),
      schoolOfEnrollment: jsonStringify(schoolofEnrollment),
      specialEd: jsonStringify(speicalEd),
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
  const handleClear = () => {
    setGrades1([])
    setGrades2([])
    setProgramYears([])
    setStatus([])
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
      status: '',
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
    handleClear()
  }, [selectedYearId])

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
                      setGrades1(value)
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
                      setGrades2(value)
                    }}
                    checkboxLists={grade2Options}
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
                    title={'Status'}
                    values={status}
                    setValues={(value) => {
                      setStatus(value)
                    }}
                    checkboxLists={defaultStatusOptions}
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
                    values={speicalEd}
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
                        ? [
                            ...defaultOtherOptions,
                            {
                              label: StudentRecordFileKind.USIRS,
                              value: StudentRecordFileKind.USIRS,
                            },
                          ]
                        : defaultOtherOptions
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
