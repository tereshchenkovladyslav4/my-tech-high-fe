import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Radio, Tooltip, Typography } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { toOrdinalSuffix } from '@mth/utils'
import { getSchoolYearsByRegionId } from '../../services'
import { diplomaSeekingClassess } from './styles'

type SchoolYear = {
  label: string
  value: number | string
}

type SchoolYearItem = {
  date_begin: string
  date_end: string
  school_year_id: string
  midyear_application: number
  midyear_application_open: string
  midyear_application_close: string
  grades: string
}

const DiplomaSeeking: React.FC = () => {
  const { me } = useContext(UserContext)
  const history = useHistory()
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('')
  const [schoolYearsData, setSchoolYearsData] = useState<SchoolYearItem[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [grades, setGrades] = useState<string[]>([])
  const [selectGrades, setSelectGrades] = useState<string[]>([])
  const [diplomaStatus, setDiplomaStatus] = useState<number>(-1)

  const { data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.region?.SchoolYears) {
      let thisYearId = ''
      const { SchoolYears } = schoolYearData?.region
      setSchoolYearsData(SchoolYears)
      const yearList: SchoolYear[] = []
      SchoolYears.map((item: SchoolYearItem): void => {
        yearList.push({
          label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
          value: item.school_year_id,
        })
        if (moment(item.date_begin).format('YYYY') === moment().format('YYYY')) {
          thisYearId = item.school_year_id // set init year
          if (item?.grades) {
            setGrades(item?.grades.split(',').sort((a: string, b: string) => (parseInt(a) > parseInt(b) ? 1 : -1)))
          } else {
            setGrades([])
          }
        }
      })
      setSelectedSchoolYear(thisYearId) // set init year
      setSchoolYears(yearList.sort((a: SchoolYear, b: SchoolYear) => (a.label > b.label ? 1 : -1)))
    }
    setSelectGrades([])
    setDiplomaStatus(-1)
  }, [schoolYearData?.region?.SchoolYears])

  useEffect(() => {
    const yearItem = schoolYearsData?.find(
      (item: { school_year_id: string }) => item.school_year_id === selectedSchoolYear,
    )
    const newGrades = yearItem?.grades?.split(',')

    if (newGrades) {
      setGrades(newGrades.sort((a: string, b: string) => (parseInt(a) > parseInt(b) ? 1 : -1)))
    } else {
      setGrades([])
    }
    setSelectGrades([])
    setDiplomaStatus(-1)
  }, [selectedSchoolYear])

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectGrades([...selectGrades, e.target.value])
    } else {
      setSelectGrades(selectGrades.filter((item: string) => item !== e.target.value))
    }
  }

  const kinderGardernGrade = () => {
    const kinderGrade = grades.find((item: string) => isNaN(+item))
    if (!kinderGrade) {
      return null
    }
    return (
      <FormControlLabel
        sx={{ height: 40 }}
        control={
          <Checkbox checked={selectGrades.includes(kinderGrade)} value={kinderGrade} onChange={handleChangeGrades} />
        }
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px', fontSize: '20px' }}>
            {kinderGrade}
          </Paragraph>
        }
      />
    )
  }

  const renderGrades = () =>
    map(
      grades.filter((item: string) => !isNaN(+item)),
      (grade: string, index: number) => {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 40 }}
            control={
              <Checkbox checked={selectGrades.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph
                size='large'
                fontWeight='500'
                sx={{ marginLeft: '12px', fontSize: '20px' }}
              >{`${toOrdinalSuffix(parseInt(grade))} Grade`}</Paragraph>
            }
          />
        )
      },
    )

  return (
    <Box sx={diplomaSeekingClassess.container}>
      <>
        <Box paddingY='13px' paddingX='20px' display='flex' justifyContent='space-between'>
          <Box>
            <IconButton
              onClick={() => history.push('/site-management/enrollment/')}
              sx={diplomaSeekingClassess.btnIcon}
            >
              <ArrowBackIosRoundedIcon sx={diplomaSeekingClassess.iconArrow} />
            </IconButton>
            <Typography paddingLeft='20px' fontSize='20px' fontWeight={700} component='span'>
              Diploma-seeking Path
            </Typography>
          </Box>
          <Box display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
            <DropDown
              dropDownItems={schoolYears}
              placeholder={'Select Year'}
              defaultValue={selectedSchoolYear}
              borderNone={true}
              setParentValue={(val) => {
                setSelectedSchoolYear(val.toString())
              }}
            />
          </Box>
        </Box>
        <Box sx={{ paddingX: 8, marginTop: 5 }}>
          <Grid container sx={{ textAlign: 'left' }}>
            <Grid item xs={6}>
              <Box>
                <Typography fontSize='16px' fontWeight={500} component='span'>
                  Select Grades That Require a Diploma-seeking Question
                </Typography>
                <Box sx={diplomaSeekingClassess.gradeGroup}>
                  {kinderGardernGrade()}
                  {renderGrades()}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography fontSize='16px' fontWeight={500} component='span'>
                  Diploma-seeking Path
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 3,
                  }}
                >
                  <Typography fontSize='14px' fontWeight={500} component='span'>
                    Does this student plan to complete the requirements to earn a Utah high school diploma (schedule
                    flexibility is limited)?
                  </Typography>
                  <Tooltip title='Edit' placement='top'>
                    <IconButton sx={diplomaSeekingClassess.diplomaQuestion}>
                      <ModeEditIcon sx={diplomaSeekingClassess.editIcon} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box>
                <Box
                  display='flex'
                  alignItems='center'
                  sx={{
                    marginTop: '10px',
                    width: '100%',
                  }}
                >
                  <Radio
                    sx={{
                      paddingLeft: 0,
                    }}
                    checked={diplomaStatus === 1}
                    onClick={() => setDiplomaStatus(1)}
                  />
                  <Subtitle size='small' sx={diplomaSeekingClassess.btnRadio}>
                    Yes
                  </Subtitle>
                </Box>

                <Box
                  display='flex'
                  alignItems='center'
                  sx={{
                    marginTop: '5px',
                    width: '100%',
                  }}
                >
                  <Radio
                    sx={{
                      paddingLeft: 0,
                    }}
                    checked={diplomaStatus === 0}
                    onClick={() => setDiplomaStatus(0)}
                  />
                  <Subtitle size='small' sx={diplomaSeekingClassess.btnRadio}>
                    No
                  </Subtitle>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={diplomaSeekingClassess.boxSave}>
          <Button sx={diplomaSeekingClassess.saveBtn}>Save</Button>
        </Box>
      </>
    </Box>
  )
}

export default DiplomaSeeking
