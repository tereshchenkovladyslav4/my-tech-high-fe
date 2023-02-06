import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { map, capitalize } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { GRADES, GRADE_GROUPS } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { getSchoolDistrictsByRegionId } from '@mth/graphql/queries/school-district'
import { useProviders } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { toOrdinalSuffix } from '@mth/utils'
import {
  FiltersProps,
  SchoolPartner,
  YEAR_STATUS,
  SchoolDistrictType,
  FilterVM,
  OptionType,
  FilteredProviderType,
} from '../type'

export const Filters: React.FC<FiltersProps> = ({
  filter,
  setFilter,
  partnerList,
  previousPartnerList,
  selectedYear,
  gradesList = [],
}) => {
  const { me } = useContext(UserContext)
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(true)
  // filter option management
  const [grades, setGrades] = useState<string[]>([])
  const [yearStatus, setYearStatus] = useState<YEAR_STATUS[]>([])
  const [schoolOfEnrollments, setSchoolOfEnrollments] = useState<string[]>([])
  const [previousSOE, setPreviousSOE] = useState<string[]>([])
  const [schoolDistrict, setSchoolDistrict] = useState<string[]>([])
  const [curriculumProvider, setCurriculumProvider] = useState<number[]>([])
  const [providerList, setProviderList] = useState<FilteredProviderType[]>([])

  const { providers } = useProviders(Number(selectedYear?.value) ?? 0)
  const { data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: !me?.selectedRegionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (providers?.length > 0) {
      setProviderList(
        providers
          .filter((p) => p.is_display)
          .map((obj) => {
            return { id: obj.id, name: obj.name }
          }),
      )
    } else {
      setProviderList([])
    }
  }, [providers])

  useEffect(() => {
    setGrades([])
    setYearStatus([])
    setSchoolOfEnrollments([])
    setSchoolDistrict([])
    setCurriculumProvider([])
    setProviderList(
      providers.map((obj) => {
        return { id: obj.id, name: obj.name }
      }),
    )
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
    // handle individual checkbox by group grade K, 1-8, 9-12
    if (GRADE_GROUPS.includes(e.target.value)) {
      const groupItems = {
        [GRADE_GROUPS[0]]: ['Kindergarten'],
        [GRADE_GROUPS[1]]: ['1', '2', '3', '4', '5', '6', '7', '8'],
        [GRADE_GROUPS[2]]: ['9', '10', '11', '12'],
      }

      const addedGroupItems = groupItems[e.target.value]
      addedGroupItems.map((item) => {
        if (e.target.checked) {
          if (!newGrades.includes(item)) {
            newGrades.push(item)
          }
        } else {
          newGrades = newGrades.filter((i) => i !== item)
        }
      })
    } else {
      if (!e.target.checked) {
        newGrades = grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all')
      } else {
        newGrades.push(e.target.value)
      }
    }
    setGrades(newGrades)
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGrades(GRADES.map((item) => item.toString()))
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

  const handlePreviousSOE = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previousSOE.includes(e.target.value)) {
      setPreviousSOE(previousSOE.filter((i) => i !== e.target.value))
    } else {
      setPreviousSOE([...previousSOE, e.target.value])
    }
  }

  const handleSchoolDistrict = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'all') {
      if (e.target.checked) {
        setSchoolDistrict([
          ...schoolDistrictsData?.schoolDistrict?.map((item: SchoolDistrictType) => item.school_district_name),
        ])
      } else {
        setSchoolDistrict([])
      }
    } else {
      if (e.target.checked) {
        setSchoolDistrict([...schoolDistrict, e.target.value])
      } else {
        setSchoolDistrict(schoolDistrict.filter((item) => ![e.target.value, 'all'].includes(item)))
      }
    }
  }

  const isCheckedAllSchoolDistrict = () => {
    let status = true
    schoolDistrictsData?.schoolDistrict?.map((item) => {
      if (!schoolDistrict.includes(item.school_district_name)) {
        status = false
      }
    })
    return status
  }

  const handleCurriculumProvider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const providerValue = +e.target.value
    if (curriculumProvider.includes(providerValue)) {
      setCurriculumProvider(curriculumProvider.filter((i) => i !== providerValue))
    } else {
      setCurriculumProvider([...curriculumProvider, providerValue])
    }
  }

  const handleFilter = () => {
    setFilter({
      ...filter,
      grades: grades,
      previousSOE,
      schoolOfEnrollments,
      schoolDistrict,
      yearStatus,
      curriculumProviders: curriculumProvider,
    })
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
    setGrades([])
    setYearStatus([])
    setSchoolOfEnrollments([])
    setSchoolDistrict([])
    setCurriculumProvider([])
    setPreviousSOE([])
    const state = {}
    history.replace({ ...history.location, state })
  }

  const renderGrades = () =>
    map(
      gradesList.sort((a) => (a === 'Kindergarten' ? -1 : 0)),
      (grade, index) => (
        <FormControlLabel
          key={index}
          sx={{ height: 30 }}
          control={<Checkbox checked={grades.includes(grade)} value={grade} onChange={handleChangeGrades} />}
          label={
            <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
              {grade === 'Kindergarten' ? grade : `${toOrdinalSuffix(parseInt(grade))}`}
            </Paragraph>
          }
        />
      ),
    )

  const columnWidth = () => {
    return gradesList?.length === GRADES.length ? 3 : 4
  }

  const isCheckedGradeGroup = (grade: string) => {
    let status = true
    switch (grade) {
      case 'K':
        return grades.includes('Kindergarten')
      case '1-8':
        ;['1', '2', '3', '4', '5', '6', '7', '8'].map((item) => {
          if (!grades.includes(item)) {
            status = false
          }
        })
        return status
      case '9-12':
        ;['9', '10', '11', '12'].map((item) => {
          if (!grades.includes(item)) {
            status = false
          }
        })
        return status
      case 'all':
        ;['Kindergarten', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((item) => {
          if (!grades.includes(item)) {
            status = false
          }
        })
        return status
      default:
        return status
    }
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
              control={<Checkbox value='all' checked={isCheckedGradeGroup('all')} onChange={handleChangeAll} />}
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
        {gradesList?.length === GRADES.length && (
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
              {GRADE_GROUPS.map((grade) => (
                <FormControlLabel
                  key={grade}
                  sx={{ height: 30 }}
                  control={
                    <Checkbox value={grade} checked={isCheckedGradeGroup(grade)} onChange={handleChangeGrades} />
                  }
                  label={
                    <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                      {grade === 'K' ? 'Kindergarten' : grade}
                    </Paragraph>
                  }
                />
              ))}
            </Box>
          </Grid>
        )}

        <Grid item xs={columnWidth()}>
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
              {selectedYear?.label ? `For ${(selectedYear.label as string).split('Mid-year')[0]}` : ''}
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
              Current SoE
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
              Previous SoE
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  value='unassigned'
                  checked={previousSOE.includes('unassigned')}
                  onChange={handlePreviousSOE}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Unassigned
                </Paragraph>
              }
            />
            {previousPartnerList.map((item: SchoolPartner, index) => (
              <FormControlLabel
                sx={{ height: 30 }}
                key={index}
                control={
                  <Checkbox
                    value={item.value}
                    checked={previousSOE.includes(item.value)}
                    onChange={handlePreviousSOE}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.abb}
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
              School District
            </Paragraph>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                height: '423px',
              }}
            >
              <FormControlLabel
                sx={{ height: 30 }}
                control={
                  <Checkbox value='all' checked={isCheckedAllSchoolDistrict()} onChange={handleSchoolDistrict} />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    Select All
                  </Paragraph>
                }
              />
              {schoolDistrictsData?.schoolDistrict?.map((district: SchoolDistrictType) => (
                <FormControlLabel
                  key={district.id}
                  sx={{ height: 30 }}
                  control={
                    <Checkbox
                      value={district.school_district_name}
                      checked={schoolDistrict.includes(district.school_district_name) || schoolDistrict.includes('all')}
                      onChange={handleSchoolDistrict}
                    />
                  }
                  label={
                    <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                      {district.school_district_name}
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
          >
            <Paragraph size='large' fontWeight='700'>
              Curriculum Provider
            </Paragraph>
            {providerList.map((item, index) => (
              <FormControlLabel
                sx={{ height: 30 }}
                key={index}
                control={
                  <Checkbox
                    value={item.id}
                    checked={curriculumProvider.includes(item.id)}
                    onChange={handleCurriculumProvider}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.name}
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
              sx={{ ...mthButtonClasses.primary, marginBottom: '12px', height: '29px', fontWeight: 500 }}
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button
              sx={{ ...mthButtonClasses.smallRed, borderRadius: '8px', height: '29px', fontWeight: 500 }}
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
