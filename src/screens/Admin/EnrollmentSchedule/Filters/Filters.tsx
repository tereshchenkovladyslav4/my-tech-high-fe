import React, { FunctionComponent, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import { map } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE, RED_GRADIENT, GRADES } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { FiltersProps } from '../type'

export const Filters: FunctionComponent<FiltersProps> = ({ filter, setFilter }) => {
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(true)
  const [grades, setGrades] = useState<string[]>([])
  const [courseTypes, setCourseTypes] = useState<string[]>([])
  const [curriculumProviders, setCurriculumProviders] = useState<string[]>([])
  const [diplomaSeeking, setDiplomaSeeking] = useState<boolean>(false)

  const providers = ['SNHU', 'Spark', 'Snow']

  const chevron = () =>
    !expand ? (
      <ChevronRightIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
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

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGrades([...grades, e.target.value])
    }
  }

  const handleChangeCourseType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (courseTypes.includes(e.target.value)) {
      setCourseTypes(courseTypes.filter((item) => item !== e.target.value))
    } else {
      setCourseTypes([...courseTypes, e.target.value])
    }
  }

  const handleChangeCurriculumProvider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (curriculumProviders.includes(e.target.value)) {
      setCurriculumProviders(curriculumProviders.filter((item) => item !== e.target.value))
    } else {
      setCurriculumProviders([...curriculumProviders, e.target.value])
    }
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGrades([...['all'], ...GRADES.map((item) => item.toString())])
    } else {
      setGrades([])
    }
  }

  const handleChangeAllProviders = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCurriculumProviders([...['All Providers'], ...providers])
    } else {
      setCurriculumProviders([])
    }
  }

  const handleChangeDiplomaSeeking = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiplomaSeeking(e.target.checked)
  }

  const handleFilter = () => {
    setFilter({
      ...filter,
      ...{
        grades,
        courseTypes,
        diplomaSeeking,
        curriculumProviders,
      },
    })
    setExpand(false)
    const state = {
      ...filter,
      ...{
        grades,
        courseTypes,
        diplomaSeeking,
        curriculumProviders,
      },
    }
    history.replace({ ...history.location, state })
  }

  const handleClear = () => {
    setGrades([])
    setCourseTypes([])
    setDiplomaSeeking(false)
    setCurriculumProviders([])
    setFilter(undefined)
    const state = {}
    history.replace({ ...history.location, state })
  }

  const renderGrades = () =>
    map(GRADES, (grade, index) => {
      if (typeof grade !== 'string') {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 30 }}
            control={
              <Checkbox checked={grades.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>{`${toOrdinalSuffix(
                grade,
              )} Grade`}</Paragraph>
            }
          />
        )
      } else {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 30 }}
            control={<Checkbox checked={grades.includes(grade)} value={grade} onChange={handleChangeGrades} />}
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                {grade}
              </Paragraph>
            }
          />
        )
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
        <Grid item xs={3}>
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
              control={<Checkbox checked={diplomaSeeking} onChange={handleChangeDiplomaSeeking} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Yes
                </Paragraph>
              }
            />
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
              Course Type
            </Paragraph>
            {['MTH Direct', '3rd Party', 'Custom built']?.map((item) => {
              return (
                <>
                  <FormControlLabel
                    sx={{ height: 30 }}
                    control={
                      <Checkbox value={item} checked={courseTypes.includes(item)} onChange={handleChangeCourseType} />
                    }
                    label={
                      <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                        {item}
                      </Paragraph>
                    }
                  />
                </>
              )
            })}
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
              Curriculum Provider
            </Paragraph>
            <Paper
              style={{
                height: 420,
                width: 200,
                overflow: 'auto',
                boxShadow: 'none',
              }}
            >
              <FormControlLabel
                sx={{ height: 30, width: '90%' }}
                control={
                  <Checkbox
                    value={'All Providers'}
                    checked={curriculumProviders.includes('All Providers')}
                    onChange={handleChangeAllProviders}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    All Providers
                  </Paragraph>
                }
              />
              {providers.map((item) => {
                return (
                  <>
                    <FormControlLabel
                      sx={{ height: 30, width: '90%' }}
                      control={
                        <Checkbox
                          value={item}
                          checked={curriculumProviders.includes(item)}
                          onChange={handleChangeCurriculumProvider}
                        />
                      }
                      label={
                        <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                          {item}
                        </Paragraph>
                      }
                    />
                  </>
                )
              })}
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Box
          sx={{
            justifyContent: 'flex-end',
            display: 'flex',
            height: '100%',
            alignItems: 'end',
            flexDirection: 'column',
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
              marginBottom: '22px',
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
      </Grid>
    </Grid>
  )

  useEffect(() => {
    if (history.location && history.location.state) {
      const state = { ...history.location.state }
      setGrades(state.grades || [])
      setCourseTypes(state.courseTypes || [])
      setDiplomaSeeking(state.diplomaSeeking || false)
      setCurriculumProviders(state.curriculumProviders || [])
      setFilter(state)
    }
  }, [])

  return (
    <Card
      sx={{ marginTop: '18px', paddingTop: '13px', paddingLeft: '15px', paddingBottom: '28px', paddingRight: '23px' }}
    >
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
