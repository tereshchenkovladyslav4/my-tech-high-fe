import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { map, capitalize } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { GRADES, GRADE_GROUPS } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { toOrdinalSuffix } from '@mth/utils'
import { FiltersProps, YEAR_STATUS, FilterVM, OptionType } from '../type'

export const Filters: React.FC<FiltersProps> = ({
  setFilter,
  partnerList,
  selectedYear,
  gradesList = [],
  specEd,
  currentHomeroomes,
  prevHomeroomes,
  providers,
  previousYear,
}) => {
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(true)
  // filter option management
  const [grades, setGrades] = useState<string[]>([])
  const [yearStatus, setYearStatus] = useState<YEAR_STATUS[]>([])
  const [schoolOfEnrollments, setSchoolOfEnrollments] = useState<string[]>([])

  const [specEdList, setSpecEdList] = useState<string[]>([])

  useEffect(() => {
    setGrades([])
    setYearStatus([])
    setSchoolOfEnrollments([])
  }, [selectedYear])

  const chevron = () =>
    !expand ? (
      <ExpandMoreIcon
        sx={{
          color: MthColor.MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
          transform: 'rotate(180deg)',
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

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newGrades = [...grades]
    if (newGrades.includes(e.target.value)) {
      newGrades = grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all')
    } else {
      newGrades.push(e.target.value)
    }
    // handle individual checkbox by group grade K, 1-8, 9-12
    if (GRADE_GROUPS.includes(e.target.value)) {
      const groupsGrades: string[] = []
      const groupItems = {
        [GRADE_GROUPS[0]]: ['Kindergarten'],
        [GRADE_GROUPS[1]]: ['1', '2', '3', '4', '5', '6', '7', '8'],
        [GRADE_GROUPS[2]]: ['9', '10', '11', '12'],
      }
      let selectedGroupCount = 0
      GRADE_GROUPS.forEach((el) => {
        if (newGrades.includes(el)) {
          selectedGroupCount++
          groupsGrades.push(...groupItems[el], el)
        }
      })
      if (selectedGroupCount < GRADE_GROUPS.length) newGrades = [...groupsGrades]
      else newGrades = [...GRADE_GROUPS]
    } else {
      // All select/deselect by individual checkbox
      if (newGrades.filter((el) => ![...GRADE_GROUPS, 'all'].includes(el)).length === gradesList.length)
        newGrades.push('all')
      else newGrades = newGrades.filter((el) => el !== 'el')
    }

    setGrades([...new Set(newGrades)])
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGrades([...['all'], ...GRADES.map((item) => item.toString())])
    } else {
      setGrades([])
    }
  }

  const handleYearStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as YEAR_STATUS
    if (yearStatus.includes(value)) {
      setYearStatus(yearStatus.filter((i) => i !== value))
    } else {
      setYearStatus([...yearStatus, value])
    }
  }

  const handleSchoolOfEnrollments = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (schoolOfEnrollments.includes(e.target.value)) {
      setSchoolOfEnrollments(schoolOfEnrollments.filter((i) => i !== e.target.value))
    } else {
      setSchoolOfEnrollments([...schoolOfEnrollments, e.target.value])
    }
  }

  const handleChangeSpecEd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setSpecEdList(specEdList.filter((i) => i !== e.target.value))
    } else {
      setSpecEdList([...specEdList, e.target.value])
    }
  }

  const handleFilter = () => {
    // setFilter({
    //   ...filter,
    //   grades: grades,
    //   previousSOE,
    //   schoolOfEnrollments,
    //   schoolDistrict,
    //   yearStatus,
    // })
    // setExpand(false)
    // const state = {
    //   ...filter,
    //   ...{
    //     grades: grades,
    //     schoolOfEnrollments,
    //     previousSOE,
    //   },
    // }
    // history.replace({ ...history.location, state })
  }
  const handleClear = () => {
    // setGrades([])
    // setYearStatus([])
    // setSchoolOfEnrollments([])
    // setSchoolDistrict([])
    // setCurriculumProvider([])
    // setPreviousSOE([])
    // const state = {}
    // history.replace({ ...history.location, state })
  }
  const renderGrades = () =>
    map(gradesList, (grade, index) => {
      if (typeof grade == 'string' && !grade.includes('Kin')) {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 40 }}
            control={
              <Checkbox checked={grades.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                {`${toOrdinalSuffix(Number(grade))} Grade`}
              </Paragraph>
            }
          />
        )
      } else if (typeof grade == 'string') {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 40 }}
            control={<Checkbox checked={grades.includes(grade)} value={grade} onChange={handleChangeGrades} />}
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                {grade === 'Kindergarten' ? grade : `${toOrdinalSuffix(parseInt(grade))} Grade`}
              </Paragraph>
            }
          />
        )
      } else {
        return undefined
      }
    })
  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={9}>
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Grade Level
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='all' checked={grades.includes('all')} onChange={handleChangeAll} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Select All
                </Paragraph>
              }
            />
            {renderGrades()}
          </Box>
        </Grid>
        {/* Group grade */}
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'scroll',
              height: '444px',
              marginRight: '16px',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              {selectedYear?.label ? `For ${(selectedYear.label as string).split('Mid-year')[0]} Year` : ''}
            </Paragraph>
            {(Object.keys(YEAR_STATUS) as Array<keyof typeof YEAR_STATUS>).map((item) => (
              <FormControlLabel
                key={item}
                sx={{ height: 30 }}
                control={
                  <Checkbox
                    value={YEAR_STATUS[item]}
                    checked={yearStatus.includes(YEAR_STATUS[item])}
                    onChange={handleYearStatus}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {capitalize(item.toLocaleLowerCase())}
                  </Paragraph>
                }
              />
            ))}

            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              SoE
            </Paragraph>
            {partnerList.map((item: OptionType, index: number) => (
              <FormControlLabel
                key={index}
                sx={{ height: 30 }}
                control={
                  <Checkbox
                    value={item.value}
                    checked={schoolOfEnrollments.includes(item.value as string)}
                    onChange={handleSchoolOfEnrollments}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.label}
                  </Paragraph>
                }
              />
            ))}

            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Special Ed
            </Paragraph>
            {specEd.map((item: string, index: number) => (
              <FormControlLabel
                key={index}
                sx={{ height: 30 }}
                control={<Checkbox value={item} checked={specEdList.includes(item)} onChange={handleChangeSpecEd} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item}
                  </Paragraph>
                }
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              {selectedYear?.label ? `Homerooms ${(selectedYear.label as string).split('Mid-year')[0]} Year` : ''}
            </Paragraph>
            {currentHomeroomes.map((item: OptionType) => (
              <FormControlLabel
                key={item.value}
                sx={{ height: 30 }}
                control={<Checkbox value={item.value} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.label}
                  </Paragraph>
                }
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              {previousYear
                ? `Homerooms ${moment(previousYear.date_begin).format('YYYY')}-${moment(previousYear.date_end).format(
                    'YY',
                  )}`
                : ''}
            </Paragraph>
            {prevHomeroomes.map((item: OptionType) => (
              <FormControlLabel
                key={item.value}
                sx={{ height: 30 }}
                control={<Checkbox value={item.value} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.label}
                  </Paragraph>
                }
              />
            ))}
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
            height: '100%',
            alignItems: 'end',
            flexDirection: 'column',
            paddingLeft: '30px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'flex-start',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Curriculum Provider
            </Paragraph>
            {providers.map((item) => (
              <FormControlLabel
                sx={{ height: 30 }}
                key={item.value}
                control={<Checkbox value={item.value} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.label}
                  </Paragraph>
                }
              />
            ))}
          </Box>
          <Box
            sx={{
              flexDirection: 'column',
              display: 'flex',
            }}
          >
            <Button
              sx={{
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                background: MthColor.BUTTON_LINEAR_GRADIENT,
                color: 'white',
                marginBottom: '12px',
                width: '140px',
              }}
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button
              sx={{
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                background: MthColor.RED_GRADIENT,
                color: 'white',
                width: '140px',
              }}
              onClick={handleClear}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )

  useEffect(() => {
    if (history.location && history.location.state) {
      const state: FilterVM = { ...history.location.state }
      setGrades(state.grades || [])
      setFilter(state)
    }
  }, [])

  return (
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
        <Subtitle fontWeight='700' color={MthColor.MTHBLUE} sx={{ cursor: 'pointer' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && Filters()}
    </Card>
  )
}
