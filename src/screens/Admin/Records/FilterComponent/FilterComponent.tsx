import React, { useContext, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Grid, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import {
  useEnrollmentPacketDocumentListByRegionId,
  useProgramYearListBySchoolYearId,
  useSchoolPartnerListByRegionIdAndSchoolYearId,
  useSchoolYearsByRegionId,
} from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { CheckBoxList } from '../../Calendar/components/CheckBoxList'
import { CheckBoxListVM } from '../../Calendar/components/CheckBoxList/CheckBoxList'
import { checkBoxListClassess } from '../../Calendar/components/CheckBoxList/styles'
import { defaultOtherOptions, defaultStatusOptions } from '../defaultValues'
import { recordClassess } from '../styles'
import { FilterComponentProps } from '../types'

const FilterComponent: React.FC<FilterComponentProps> = ({ setFilter }) => {
  const { me } = useContext(UserContext)
  const [expand, setExpand] = useState<boolean>(true)
  const [grades1, setGrades1] = useState<string[]>([])
  const [grades2, setGrades2] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string | number>('')
  const [programYears, setProgramYears] = useState<string[]>([])
  const [status, setStatus] = useState<string[]>([])
  const [schoolofEnrollment, setSchoolofEnrollment] = useState<string[]>([])
  const [speicalEd, setSpecialEd] = useState<string[]>([])
  const [enrollmentPacketDocument, setEnrollmentPacketDocument] = useState<string[]>([])
  const [other, setOther] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined | null>(null)
  const [endDate, setEndDate] = useState<Date | undefined | null>(null)
  const { programYearList, gradeList, speicalEdList } = useProgramYearListBySchoolYearId(Number(selectedYear))
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )
  const { data: enrollmentPacketDocumentList } = useEnrollmentPacketDocumentListByRegionId(Number(me?.selectedRegionId))
  const { schoolOfEnrollmentList } = useSchoolPartnerListByRegionIdAndSchoolYearId(
    Number(me?.selectedRegionId),
    Number(selectedYear),
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
    !expand ? (
      <ChevronRightIcon
        sx={{
          color: MthColor.MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    ) : (
      <ExpandMoreIcon
        sx={{
          color: MthColor.MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    )
  const handleFilter = () => {
    setFilter({
      gradeLevel1: JSON.stringify(grades1),
      gradeLevel2: JSON.stringify(grades2),
      programYear: JSON.stringify(programYears),
      status: JSON.stringify(status),
      schoolOfEnrollment: JSON.stringify(schoolofEnrollment),
      specialEd: JSON.stringify(speicalEd),
      EnrollmentPacketDocuments: JSON.stringify(enrollmentPacketDocument),
      other: JSON.stringify(other),
      dateRange: {
        startDate: startDate,
        endDate: endDate,
      },
    })
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
    })
  }

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  return (
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
        <Subtitle fontWeight='700' color={MthColor.MTHBLUE} sx={{ cursor: 'pointer' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && (
        <>
          <Box sx={recordClassess.dropDownContainer}>
            <DropDown
              dropDownItems={schoolYearDropdownItems}
              placeholder={'Select Year'}
              defaultValue={selectedYear}
              borderNone={true}
              setParentValue={(val) => {
                setSelectedYear(Number(val))
              }}
            />
          </Box>
          <Grid container sx={{ textAlign: 'left' }}>
            <Grid item container xs={12} lg={12}>
              <Grid item xs={12} lg={2}>
                <Box sx={checkBoxListClassess.container}>
                  <CheckBoxList
                    title={'Grade Level'}
                    values={grades1}
                    setValues={(value) => {
                      setGrades1(value)
                    }}
                    checkboxLists={gradeList}
                    haveSelectAll={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={2}>
                <Box sx={checkBoxListClassess.container}>
                  <CheckBoxList
                    title={'Grade Level'}
                    values={grades2}
                    setValues={(value) => {
                      setGrades2(value)
                    }}
                    checkboxLists={grade2Options}
                    haveSelectAll={false}
                  />
                  <CheckBoxList
                    title={'Program Year'}
                    values={programYears}
                    setValues={(value) => {
                      setProgramYears(value)
                    }}
                    checkboxLists={programYearList}
                    haveSelectAll={false}
                  />
                  <CheckBoxList
                    title={'Status'}
                    values={status}
                    setValues={(value) => {
                      setStatus(value)
                    }}
                    checkboxLists={defaultStatusOptions}
                    haveSelectAll={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={2}>
                <Box sx={checkBoxListClassess.container}>
                  <CheckBoxList
                    title={'School of Enrollment'}
                    values={schoolofEnrollment}
                    setValues={(value) => {
                      setSchoolofEnrollment(value)
                    }}
                    checkboxLists={schoolOfEnrollmentList}
                    haveSelectAll={false}
                  />
                  <CheckBoxList
                    title={'Special Ed'}
                    values={speicalEd}
                    setValues={(value) => {
                      setSpecialEd(value)
                    }}
                    checkboxLists={speicalEdList}
                    haveSelectAll={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Box sx={checkBoxListClassess.container}>
                  <Paragraph size='large' fontWeight='700'>
                    {'Files'}
                  </Paragraph>
                  <CheckBoxList
                    title={'Enrollment Packet Documents'}
                    values={enrollmentPacketDocument}
                    setValues={(value) => {
                      setEnrollmentPacketDocument(value)
                    }}
                    checkboxLists={enrollmentPacketDocumentList}
                    haveSelectAll={false}
                  />
                  <CheckBoxList
                    title={'Other'}
                    values={other}
                    setValues={(value) => {
                      setOther(value)
                    }}
                    checkboxLists={defaultOtherOptions}
                    haveSelectAll={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Paragraph size='large' fontWeight='700'>
                  {'Date Range'}
                </Paragraph>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={recordClassess.dateGroup}>
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
          <Box sx={recordClassess.btnGroup}>
            <Button sx={recordClassess.clearAllBtn} onClick={handleClear}>
              Clear All
            </Button>
            <Button sx={recordClassess.filterBtn} onClick={handleFilter}>
              Filter
            </Button>
          </Box>
        </>
      )}
    </Card>
  )
}

export default FilterComponent
