import React, { FunctionComponent, useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { map } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import {
  BUTTON_LINEAR_GRADIENT,
  MTHBLUE,
  RED_GRADIENT,
  GRADES,
  CURRICULUM_PROVIDERS,
} from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { FiltersProps, COURSE_TYPE, FilterVM } from '../type'

export const Filters: FunctionComponent<FiltersProps> = ({ filter, setFilter }) => {
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(true)
  const [grades, setGrades] = useState<string[]>([])
  const [diploma, setDiploma] = useState<boolean>(false)
  const [courseType, setCourseType] = useState<COURSE_TYPE[]>([])
  const [curriculumProviders, setCurriculumProviders] = useState<string[]>([])

  const chevron = () =>
    !expand ? (
      <ExpandMoreIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
          transform: 'rotate(180deg)',
        }}
      />
    ) : (
      <ExpandMoreIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    )

  const handleCurriculumProviders = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newCurriculumProviders = [...curriculumProviders]
    if (newCurriculumProviders.includes(e.target.value)) {
      newCurriculumProviders = curriculumProviders
        .filter((item) => item !== e.target.value)
        .filter((item) => item !== 'all')
    } else {
      newCurriculumProviders.push(e.target.value)
    }
    if (newCurriculumProviders.length === CURRICULUM_PROVIDERS.length) {
      newCurriculumProviders.push('all')
    }
    setCurriculumProviders([...newCurriculumProviders])
  }

  const handleChangeAllCP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCurriculumProviders([...['all'], ...CURRICULUM_PROVIDERS.map((item) => item.toString())])
    } else {
      setCurriculumProviders([])
    }
  }

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newGrades = [...grades]
    if (newGrades.includes(e.target.value)) {
      newGrades = grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all')
    } else {
      newGrades.push(e.target.value)
    }
    if (newGrades.length === GRADES.length) {
      newGrades.push('all')
    }
    setGrades([...newGrades])
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGrades([...['all'], ...GRADES.map((item) => item.toString())])
    } else {
      setGrades([])
    }
  }

  const handlesetCourseType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as COURSE_TYPE
    if (courseType.includes(value)) {
      setCourseType(courseType.filter((i) => i !== value))
    } else {
      setCourseType([...courseType, value])
    }
  }

  const handleFilter = () => {
    setFilter({
      ...filter,
      grades: grades,
      diplomaSeeking: diploma,
      courseType: courseType,
      curriculumProviders: curriculumProviders,
    })
  }
  const handleClear = () => {
    setGrades([])
    setDiploma(false)
    setCourseType([])
    setCurriculumProviders([])
    const state = {}
    history.replace({ ...history.location, state })
  }

  const renderGrades = () =>
    map(GRADES, (grade, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={<Checkbox checked={grades.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />}
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {grade === 'Kindergarten' ? grade : `${toOrdinalSuffix(grade)} Grade`}
          </Paragraph>
        }
      />
    ))

  const columnWidth = () => {
    return 3
  }

  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={9}>
        <Grid item xs={columnWidth()}>
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

        <Grid item xs={columnWidth()}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Diploma-seeking
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox checked={diploma} onChange={() => setDiploma((prevState) => !prevState)} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Yes
                </Paragraph>
              }
            />
          </Box>
        </Grid>

        <Grid item xs={columnWidth()}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '444px',
              marginRight: '16px',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Course Type
            </Paragraph>
            {(Object.keys(COURSE_TYPE) as Array<keyof typeof COURSE_TYPE>).map((item) => (
              <FormControlLabel
                key={item}
                sx={{ height: 30 }}
                control={
                  <Checkbox
                    value={COURSE_TYPE[item]}
                    checked={courseType.includes(COURSE_TYPE[item])}
                    onChange={handlesetCourseType}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {COURSE_TYPE[item]}
                  </Paragraph>
                }
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={columnWidth()}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Curriculum Providers
            </Paragraph>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                height: '423px',
              }}
            >
              <FormControlLabel
                sx={{ height: 30 }}
                control={
                  <Checkbox value='all' checked={curriculumProviders.includes('all')} onChange={handleChangeAllCP} />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    All providers
                  </Paragraph>
                }
              />
              {CURRICULUM_PROVIDERS.map((provider: string) => (
                <FormControlLabel
                  key={provider}
                  sx={{ height: 30 }}
                  control={
                    <Checkbox
                      onChange={handleCurriculumProviders}
                      checked={curriculumProviders.includes(provider)}
                      value={provider}
                    />
                  }
                  label={
                    <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                      {provider}
                    </Paragraph>
                  }
                />
              ))}
            </Box>
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
          />
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
                background: BUTTON_LINEAR_GRADIENT,
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
                background: RED_GRADIENT,
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
        <Subtitle fontWeight='700' color={MTHBLUE} sx={{ cursor: 'pointer' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && Filters()}
    </Card>
  )
}
