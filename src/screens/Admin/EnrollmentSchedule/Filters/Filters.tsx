import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { map } from 'lodash'
import { useHistory } from 'react-router-dom'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE, RED_GRADIENT, CURRICULUM_PROVIDERS } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { getSchoolYear } from '../../Curriculum/services'
import { getSchoolYearsByRegionId } from '../../SiteManagement/services'
import { SchoolYearDropDown } from '../SchoolYearDropDown/SchoolYearDropDown'
import { FiltersProps, COURSE_TYPE, FilterVM } from '../type'

export const Filters: FunctionComponent<FiltersProps> = ({ filter, setFilter }) => {
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(true)
  const [grades, setGrades] = useState<string[]>([])
  const [diploma, setDiploma] = useState<number>()
  const [courseType, setCourseType] = useState<COURSE_TYPE[]>([])
  const [curriculumProviders, setCurriculumProviders] = useState<string[]>([])
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [schoolYears, setSchoolYears] = useState([])
  const [gradeLevels, setGradeLevels] = useState([])
  const [showDiplomaSeeking, setShowDiplomaSeeking] = useState(false)
  const [showCustomBuilt, setShowCustomBuilt] = useState<number>(0)
  const [showThirdParty, setShowThirdParty] = useState<number>(0)

  const { me } = useContext(UserContext)

  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    setSchoolYears(schoolYearData?.data?.region?.SchoolYears)
  }, [schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    if (schoolYears?.length > 0 && selectedYearId > 0) {
      const tempSchoolyears = schoolYears
      const schoolYear = tempSchoolyears.filter((year) => year.school_year_id === selectedYearId)
      if (schoolYear.length > 0) {
        setGradeLevels(
          schoolYear[0]?.grades?.split(',').sort((n1: string, n2: string) => {
            if (n1 === 'Kindergarten') return -1
            if (parseInt(n1) < parseInt(n2)) return -1
            return 1
          }),
        )
        setShowDiplomaSeeking(schoolYear[0]?.diploma_seeking)
      }
    }
  }, [schoolYears, selectedYearId])

  const [getSchoolYearData, responseData] = useLazyQuery(getSchoolYear, {
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    getSchoolYearData({
      skip: me?.selectedRegionId ? false : true,
      variables: {
        school_year_id: selectedYearId,
      },
    })
  }, [selectedYearId])

  useEffect(() => {
    if (responseData?.data?.getSchoolYear?.ScheduleBuilder) {
      if (responseData?.data?.getSchoolYear?.ScheduleBuilder?.custom_built === 1) {
        setShowCustomBuilt(1)
      } else {
        setShowCustomBuilt(0)
      }
      if (responseData?.data?.getSchoolYear?.ScheduleBuilder?.third_party_provider === 1) {
        setShowThirdParty(1)
      } else {
        setShowThirdParty(0)
      }
    } else {
      setShowCustomBuilt(0)
      setShowThirdParty(0)
    }
  }, [responseData?.data])

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
    if (newGrades.length === gradeLevels.length) {
      newGrades.push('all')
    }
    setGrades([...newGrades])
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGrades([...['all'], ...gradeLevels.map((item) => item.toString())])
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
      selectedYearId: selectedYearId,
    })
  }
  const handleClear = () => {
    const emptyFilter = {}
    setFilter({
      ...emptyFilter,
    })
    setGrades([])
    setDiploma(null)
    setCourseType([])
    setCurriculumProviders([])
    const state = {}
    history.replace({ ...history.location, state })
  }

  const renderGrades = () =>
    map(gradeLevels, (grade, index) => (
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
    return courseType.includes('MTH Direct') && showDiplomaSeeking ? 2 : 3
  }

  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={10}>
        <Grid item xs={columnWidth()}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              School Years
            </Paragraph>
            <SchoolYearDropDown selectedYearId={selectedYearId} setSelectedYearId={setSelectedYearId} />
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
              Grade Level
            </Paragraph>
            {gradeLevels?.length > 0 && (
              <FormControlLabel
                sx={{ height: 30 }}
                control={<Checkbox value='all' checked={grades.includes('all')} onChange={handleChangeAll} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    Select All
                  </Paragraph>
                }
              />
            )}
            {renderGrades()}
          </Box>
        </Grid>

        {showDiplomaSeeking && (
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
                control={<Checkbox checked={diploma === 1} onChange={() => setDiploma(diploma === 1 ? 0 : 1)} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    Yes
                  </Paragraph>
                }
              />
            </Box>
          </Grid>
        )}

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
            {(Object.keys(COURSE_TYPE) as Array<keyof typeof COURSE_TYPE>).map(
              (item) =>
                !(
                  (COURSE_TYPE[item] === '3rd Party' && showThirdParty === 0) ||
                  (COURSE_TYPE[item] === 'Custom-built' && showCustomBuilt === 0)
                ) && (
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
                ),
            )}
          </Box>
        </Grid>
        {courseType.includes('MTH Direct') && (
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
        )}
      </Grid>
      <Grid item xs={2}>
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
