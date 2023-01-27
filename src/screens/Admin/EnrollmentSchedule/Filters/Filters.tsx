import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel } from '@mui/material'
import { map } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { CourseType, MthColor } from '@mth/enums'
import { useProviders } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { toOrdinalSuffix } from '@mth/utils'
import { getSchoolYear } from '../../Curriculum/services'
import { getSchoolYearsByRegionId } from '../../SiteManagement/services'
import { FiltersProps, COURSE_TYPE } from '../type'

export const Filters: React.FC<FiltersProps> = ({ filter, setFilter }) => {
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(true)
  const [grades, setGrades] = useState<string[]>([])
  const [diploma, setDiploma] = useState<number>()
  const [courseType, setCourseType] = useState<CourseType[]>([])
  const [mthDirectProvider, setMthDirectProvider] = useState<number[]>([])
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [gradeLevels, setGradeLevels] = useState<string[]>([])
  const [showDiplomaSeeking, setShowDiplomaSeeking] = useState(false)
  const [showCustomBuilt, setShowCustomBuilt] = useState<number>(0)
  const [showThirdParty, setShowThirdParty] = useState<number>(0)
  const [providerList, setProviderList] = useState<{ id: number; name: string }[]>([])

  const { me } = useContext(UserContext)
  const { providers } = useProviders(selectedYearId!)

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
    setSelectedYearId(filter?.selectedYearId)
  }, [filter?.selectedYearId])

  useEffect(() => {
    if (schoolYears?.length > 0 && selectedYearId && selectedYearId > 0) {
      const tempSchoolYears = schoolYears
      const schoolYear = tempSchoolYears.filter((year) => year.school_year_id === selectedYearId)
      if (schoolYear.length > 0) {
        setGradeLevels(
          schoolYear[0]?.grades?.split(',').sort((n1: string, n2: string) => {
            if (n1 === 'Kindergarten') return -1
            if (parseInt(n1) < parseInt(n2)) return -1
            return 1
          }),
        )
        setShowDiplomaSeeking(schoolYear[0]?.diploma_seeking)
        setMthDirectProvider([])
        setCourseType([])
      }
    }
  }, [schoolYears, selectedYearId])

  const [getSchoolYearData, responseData] = useLazyQuery(getSchoolYear, {
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (me?.selectedRegionId && selectedYearId)
      getSchoolYearData({
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

  const handleCheckCurriculumProviders = (e: React.ChangeEvent<HTMLInputElement>) => {
    const providerValue = +e.target.value
    let newMthProviders = mthDirectProvider
    if (providerValue === 0) {
      if (mthDirectProvider.length === providerList.length) {
        newMthProviders = []
      } else {
        newMthProviders = providerList.map((obj) => obj.id)
      }
    } else {
      if (mthDirectProvider.includes(providerValue)) {
        newMthProviders = mthDirectProvider.filter((item) => item !== providerValue)
      } else {
        newMthProviders.push(providerValue)
      }
    }

    setMthDirectProvider([...newMthProviders])
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
      setGrades([...['all'], ...gradeLevels.map((item) => item as string)])
    } else {
      setGrades([])
    }
  }

  const handleSetCourseType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as CourseType
    if (value === CourseType.MTH_DIRECT) {
      setProviderList(
        providers
          .filter((p) => p.is_display)
          .map((obj) => {
            return { id: obj.id, name: obj.name }
          }),
      )
    }
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
      curriculumProviders: mthDirectProvider,
      selectedYearId: selectedYearId ?? 0,
    })
  }
  const handleClear = () => {
    setFilter({ selectedYearId: selectedYearId ?? 0 })
    setGrades([])
    setDiploma(undefined)
    setCourseType([])
    setMthDirectProvider([])
    const state = {}
    history.replace({ ...history.location, state })
  }

  const renderGrades = () =>
    map(gradeLevels, (grade, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={<Checkbox checked={grades.includes(grade as string)} value={grade} onChange={handleChangeGrades} />}
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {grade === 'Kindergarten' ? grade : `${toOrdinalSuffix(+grade)} Grade`}
          </Paragraph>
        }
      />
    ))

  const Filters = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'left',
        marginY: '12px',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', gap: '24px', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '16%',
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

        {showDiplomaSeeking && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '16%',
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
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '444px',
            width: '16%',
            marginRight: '16px',
          }}
        >
          <Paragraph size='large' fontWeight='700'>
            Course Type
          </Paragraph>
          {(Object.keys(CourseType) as Array<keyof typeof CourseType>).map((item) => {
            return (
              !(
                (CourseType[item] === CourseType.THIRD_PARTY_PROVIDER && showThirdParty === 0) ||
                (CourseType[item] === CourseType.CUSTOM_BUILT && showCustomBuilt === 0)
              ) && (
                <FormControlLabel
                  key={item}
                  sx={{ height: 30 }}
                  control={
                    <Checkbox
                      value={CourseType[item]}
                      checked={courseType.includes(CourseType[item])}
                      onChange={handleSetCourseType}
                    />
                  }
                  label={
                    <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                      {CourseType[item] === CourseType.MTH_DIRECT
                        ? COURSE_TYPE.MTH
                        : CourseType[item] === CourseType.CUSTOM_BUILT
                        ? COURSE_TYPE.CUSTOM_BUILT
                        : COURSE_TYPE.THIRD_PARTY}
                    </Paragraph>
                  }
                />
              )
            )
          })}
        </Box>
        {courseType.includes(CourseType.MTH_DIRECT) && (
          <Box sx={{ height: '340px', width: '41%', overflowY: 'scroll' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '358px',
              }}
            >
              <Paragraph size='large' fontWeight='700'>
                Curriculum Provider
              </Paragraph>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  sx={{ height: 30 }}
                  control={
                    <Checkbox
                      value={0}
                      checked={mthDirectProvider.length === providerList.length ? true : false}
                      onChange={handleCheckCurriculumProviders}
                    />
                  }
                  label={
                    <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                      All Providers
                    </Paragraph>
                  }
                />
                {providerList.map((provider) => (
                  <FormControlLabel
                    key={provider.id}
                    sx={{ height: 30 }}
                    control={
                      <Checkbox
                        onChange={handleCheckCurriculumProviders}
                        checked={mthDirectProvider.includes(provider.id)}
                        value={provider.id}
                      />
                    }
                    label={
                      <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px', textTransform: 'capitalize' }}>
                        {provider.name}
                      </Paragraph>
                    }
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ width: '150px' }}>
        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
            height: '100%',
            alignItems: 'end',
            flexDirection: 'column',
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
                fontSize: 12,
                fontWeight: 400,
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
                fontSize: 12,
                fontWeight: 400,
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
      </Box>
    </Box>
  )

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
