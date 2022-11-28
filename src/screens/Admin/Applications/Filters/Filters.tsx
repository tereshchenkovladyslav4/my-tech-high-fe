import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { MthTitle } from '@mth/enums'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE, RED_GRADIENT, GRADES, GRADE_GROUPS } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { getActiveSchoolYearsByRegionId } from '../../../Applications/NewParent/service'
import { FiltersProps, SchoolYearVM } from '../type'

export const Filters: FunctionComponent<FiltersProps> = ({ filter, setFilter }) => {
  const { me } = useContext(UserContext)
  const history = useHistory()
  const [expand, setExpand] = useState<boolean>(false)
  const [grades, setGrades] = useState<string[]>([])
  const [availableGrades, setAvailableGrades] = useState<(string | number)[]>([])
  const [availableGradeGroup, setAvailableGradeGroup] = useState<boolean>(true)
  const [schoolYear, setSchoolYear] = useState<string[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYearVM[]>([])
  const [specialEd, setSpecialEd] = useState<string[]>([])
  const [status, setStatus] = useState<string[]>([])
  const [accountStatus, setAccountStatus] = useState<string[]>([])
  const [visibility, setVisibility] = useState<string[]>([])
  const { loading: schoolYearLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

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
  const handleChangeSchoolYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (schoolYear.includes(e.target.value)) {
      setSchoolYear(schoolYear.filter((item) => item !== e.target.value))
    } else {
      setSchoolYear([...schoolYear, e.target.value])
    }
  }
  const handleChangeSpecialEd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (specialEd.includes(e.target.value)) {
      setSpecialEd(specialEd.filter((item) => item !== e.target.value))
    } else {
      setSpecialEd([...specialEd, e.target.value])
    }
  }
  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status.includes(e.target.value)) {
      setStatus(status.filter((item) => item !== e.target.value))
    } else {
      setStatus([...status, e.target.value])
    }
  }
  const handleChangeAccountStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (accountStatus.includes(e.target.value)) {
      setAccountStatus(accountStatus.filter((item) => item !== e.target.value))
    } else {
      setAccountStatus([...accountStatus, e.target.value])
    }
  }
  const handleChangeVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (visibility.includes(e.target.value)) {
      setVisibility(visibility.filter((item) => item !== e.target.value))
    } else {
      setVisibility([...visibility, e.target.value])
    }
  }
  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (schoolYear.length == 0) setGrades([...['all'], ...GRADES.map((item) => item.toString())])
      else setGrades([...['all'], ...availableGrades.map((item) => item.toString())])
    } else {
      setGrades([])
    }
  }
  const handleFilter = () => {
    setFilter({
      ...filter,
      ...{
        grades: grades,
        accountStatus: accountStatus,
        status: status,
        specialEd: specialEd,
        schoolYear: schoolYear,
        visibility,
      },
    })
    setExpand(false)
    const state = {
      ...filter,
      ...{
        grades: grades,
        accountStatus: accountStatus,
        status: status,
        specialEd: specialEd,
        schoolYear: schoolYear,
        visibility,
      },
    }
    history.replace({ ...history.location, state })
  }
  const handleClear = () => {
    setGrades([])
    setSpecialEd([])
    setAccountStatus([])
    setStatus([])
    setSchoolYear([])
    setVisibility([])
    setFilter(undefined)
    const state = {}
    history.replace({ ...history.location, state })
  }

  useEffect(() => {
    const additionalGrades: (string | number)[] = []
    schoolYears.map((item) => {
      if (schoolYear.includes(String(item.school_year_id)) || schoolYear.includes(item.school_year_id + '-midyear')) {
        if (item.grades != null) {
          const eachGrades = item.grades.split(',')
          eachGrades.map((i) => {
            if (isNaN(Number(i))) {
              if (!additionalGrades.includes(i)) additionalGrades.push(i)
            } else {
              if (!additionalGrades.includes(Number(i))) additionalGrades.push(Number(i))
            }
          })
        }
      }
    })
    setAvailableGrades(
      additionalGrades.sort((n1, n2) => {
        if (typeof n1 == 'string') return -1
        if (typeof n2 == 'string') return 1
        return n1 - n2
      }),
    )
  }, [schoolYear])

  useEffect(() => {
    if (!availableGrades.includes('Kindergarten')) {
      setAvailableGradeGroup(false)
      return
    }

    const checker = (arr: (number | string)[], target: number[]) => target.every((v) => arr.includes(v))

    if (!checker(availableGrades, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])) {
      setAvailableGradeGroup(false)
      return
    }
    setAvailableGradeGroup(true)
  }, [availableGrades])

  const renderGrades = () =>
    map(schoolYear.length == 0 ? GRADES : availableGrades, (grade, index) => {
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

  const renderEachGradeGroups = () =>
    map(GRADE_GROUPS, (grade, index) => {
      return (
        <FormControlLabel
          key={index}
          sx={{ height: 30 }}
          control={<Checkbox value={grade} checked={grades.includes(grade)} onChange={handleChangeGrades} />}
          label={
            <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
              {grade == 'K' ? 'Kindergarten' : grade}
            </Paragraph>
          }
        />
      )
    })

  const renderGradeGroups = () => {
    if (schoolYear.length != 0 && availableGradeGroup == false) {
      return <></>
    }
    return (
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
          {renderEachGradeGroups()}
        </Box>
      </Grid>
    )
  }

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
        {renderGradeGroups()}
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              {MthTitle.SCHOOL_YEAR}
            </Paragraph>
            {schoolYears?.map((item, index) => {
              if (item.midyear_application) {
                return (
                  <>
                    <FormControlLabel
                      sx={{ height: 30 }}
                      control={
                        <Checkbox
                          value={`${item.school_year_id}`}
                          checked={schoolYear.includes(`${item.school_year_id}`)}
                          onChange={handleChangeSchoolYear}
                        />
                      }
                      label={
                        <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                          {`${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`}
                        </Paragraph>
                      }
                    />
                    <FormControlLabel
                      sx={{ height: 30 }}
                      control={
                        <Checkbox
                          value={`${item.school_year_id}-midyear`}
                          checked={schoolYear.includes(`${item.school_year_id}-midyear`)}
                          onChange={handleChangeSchoolYear}
                        />
                      }
                      label={
                        <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                          {`${moment(item.midyear_application_open).format('YYYY')}-${moment(
                            item.midyear_application_close,
                          ).format('YY')} Mid-year`}
                        </Paragraph>
                      }
                    />
                  </>
                )
              } else {
                return (
                  <FormControlLabel
                    sx={{ height: 30 }}
                    key={index}
                    control={
                      <Checkbox
                        value={`${item.school_year_id}`}
                        checked={schoolYear.includes(`${item.school_year_id}`)}
                        onChange={handleChangeSchoolYear}
                      />
                    }
                    label={
                      <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                        {`${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`}
                      </Paragraph>
                    }
                  />
                )
              }
            })}

            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Special Ed
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='1' checked={specialEd.includes('1')} onChange={handleChangeSpecialEd} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  IEP
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='2' checked={specialEd.includes('2')} onChange={handleChangeSpecialEd} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  504
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='3' checked={specialEd.includes('3')} onChange={handleChangeSpecialEd} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Exit
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='0' checked={specialEd.includes('0')} onChange={handleChangeSpecialEd} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  None
                </Paragraph>
              }
            />

            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Relation
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='1' checked={status.includes('1')} onChange={handleChangeStatus} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Sibling
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='0' checked={status.includes('0')} onChange={handleChangeStatus} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  New
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='2' checked={status.includes('2')} onChange={handleChangeStatus} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Returning
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
              Account Status
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  value='Verified'
                  checked={accountStatus.includes('Verified')}
                  onChange={handleChangeAccountStatus}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Verified
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  value='Unverified'
                  checked={accountStatus.includes('Unverified')}
                  onChange={handleChangeAccountStatus}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Unverified
                </Paragraph>
              }
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Visibility
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='1' checked={visibility.includes('1')} onChange={handleChangeVisibility} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Hidden
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='0' checked={visibility.includes('0')} onChange={handleChangeVisibility} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Unhidden
                </Paragraph>
              }
            />
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
      </Grid>
    </Grid>
  )

  useEffect(() => {
    if (history.location && history.location.state) {
      const state = { ...history.location.state }
      setGrades(state.grades || [])
      setSpecialEd(state.specialEd || [])
      setAccountStatus(state.accountStatus || [])
      setStatus(state.status || [])
      setSchoolYear(state.schoolYear || [])
      setVisibility(state.visibility || [])
      setFilter(state)
    }
  }, [])

  useEffect(() => {
    if (!schoolYearLoading && schoolYearData.getSchoolYearsByRegionId) {
      setSchoolYear([])
      setSchoolYears(schoolYearData.getSchoolYearsByRegionId)
    }
  }, [schoolYearData])

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
