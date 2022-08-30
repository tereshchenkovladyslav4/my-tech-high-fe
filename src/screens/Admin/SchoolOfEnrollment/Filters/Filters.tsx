import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { map } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE, RED_GRADIENT, GRADES } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { getSchoolDistrictsByRegionId } from '../../SiteManagement/EnrollmentSetting/ApplicationQuestions/services'
import { FiltersProps, PartnerItem, YEAR_STATUS } from '../type'

export const Filters: FunctionComponent<FiltersProps> = ({
  filter,
  setFilter,
  partnerList,
  previousPartnerList,
  selectedYear,
  gradesList,
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
  const [curriculumProvider, setCurriculumProvider] = useState<string[]>([])

  const { data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: !me?.selectedRegionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    setGrades([])
    setYearStatus([])
    setSchoolOfEnrollments([])
    setSchoolDistrict([])
    setCurriculumProvider([])
  }, [selectedYear])

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

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGrades([...grades, e.target.value])
    }
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGrades([...['all'], ...GRADES.map((item) => item.toString())])
    } else {
      setGrades([])
    }
  }

  const handleYearStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (yearStatus.includes(e.target.value)) {
      setYearStatus(yearStatus.filter((i) => i !== e.target.value))
    } else {
      setYearStatus([...yearStatus, e.target.value])
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
        setSchoolDistrict(['all', ...schoolDistrictsData?.schoolDistrict?.map((item) => item.id.toString())])
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

  const handleCurriculumProvider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (curriculumProvider.includes(e.target.value)) {
      setCurriculumProvider(curriculumProvider.filter((i) => i !== e.target.value))
    } else {
      setCurriculumProvider([...curriculumProvider, e.target.value])
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
    map(gradesList, (grade, index) => {
      if (parseInt(grade) == grade) {
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

  const columnWidth = () => {
    return gradesList?.length === GRADES.length ? 3 : 4
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
              <FormControlLabel
                sx={{ height: 30 }}
                control={<Checkbox value='K' checked={grades.includes('K')} onChange={handleChangeGrades} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    Kindergarten
                  </Paragraph>
                }
              />
              <FormControlLabel
                sx={{ height: 30 }}
                control={<Checkbox value='1-8' checked={grades.includes('1-8')} onChange={handleChangeGrades} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    1-8
                  </Paragraph>
                }
              />
              <FormControlLabel
                sx={{ height: 30 }}
                control={<Checkbox value='9-12' checked={grades.includes('9-12')} onChange={handleChangeGrades} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    9-12
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
              overflowY: 'scroll',
              height: '444px',
              marginRight: '16px',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              For {selectedYear?.label?.split('Mid-year')[0]} Year
            </Paragraph>
            {Object.keys(YEAR_STATUS).map((item) => (
              <FormControlLabel
                key={item}
                sx={{ height: 30 }}
                control={<Checkbox value={item} checked={yearStatus.includes(item)} onChange={handleYearStatus} />}
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {YEAR_STATUS[item]}
                  </Paragraph>
                }
              />
            ))}

            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Current SOE
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  value='unassigned'
                  checked={schoolOfEnrollments.includes('unassigned')}
                  onChange={handleSchoolOfEnrollments}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Unassigned
                </Paragraph>
              }
            />
            {partnerList.map((item: PartnerItem, index: number) => (
              <FormControlLabel
                key={index}
                sx={{ height: 30 }}
                control={
                  <Checkbox
                    value={item.value}
                    checked={schoolOfEnrollments.includes(item.value)}
                    onChange={handleSchoolOfEnrollments}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item.abb}
                  </Paragraph>
                }
              />
            ))}

            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Previous SOE
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
            {previousPartnerList.map((item: PartnerItem, index) => (
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
                  <Checkbox value='all' checked={schoolDistrict.includes('all')} onChange={handleSchoolDistrict} />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    Select All
                  </Paragraph>
                }
              />
              {schoolDistrictsData?.schoolDistrict?.map((district) => (
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
            {['CfA', 'Spark', 'Snow'].map((item, index) => (
              <FormControlLabel
                sx={{ height: 30 }}
                key={index}
                control={
                  <Checkbox
                    value={item}
                    checked={curriculumProvider.includes(item)}
                    onChange={handleCurriculumProvider}
                  />
                }
                label={
                  <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                    {item}
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
      const state = { ...history.location.state }
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
