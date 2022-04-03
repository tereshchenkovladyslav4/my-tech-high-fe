import { Box, Button, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE, RED_GRADIENT, GRADES } from '../../../../utils/constants'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { useHistory } from 'react-router-dom'
export const Filters = ({ filter, setFilter }) => {
  const history = useHistory()
  const [expand, setExpand] = useState(false)
  const [grades, setGrades] = useState([])
  const [schoolYear, setSchoolYear] = useState([])
  const [specialEd, setSpecialEd] = useState([])
  const [status, setStatus] = useState([])
  const [accountStatus, setAccountStatus] = useState([])
  const [visibility, setVisibility] = useState([])
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
  const handleChangeGrades = (e) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGrades([...grades, e.target.value])
    }
  }
  const handleChangeSchoolYear = (e) => {
    if (schoolYear.includes(e.target.value)) {
      setSchoolYear(schoolYear.filter((item) => item !== e.target.value))
    } else {
      setSchoolYear([...schoolYear, e.target.value])
    }
  }
  const handleChangeSpecialEd = (e) => {
    if (specialEd.includes(e.target.value)) {
      setSpecialEd(specialEd.filter((item) => item !== e.target.value))
    } else {
      setSpecialEd([...specialEd, e.target.value])
    }
  }
  const handleChangeStatus = (e) => {
    if (status.includes(e.target.value)) {
      setStatus(status.filter((item) => item !== e.target.value))
    } else {
      setStatus([...status, e.target.value])
    }
  }
  const handleChangeAccountStatus = (e) => {
    if (accountStatus.includes(e.target.value)) {
      setAccountStatus(accountStatus.filter((item) => item !== e.target.value))
    } else {
      setAccountStatus([...accountStatus, e.target.value])
    }
  }
  const handleChangeVisibility = (e) => {
    if (visibility.includes(e.target.value)) {
      setVisibility(visibility.filter((item) => item !== e.target.value))
    } else {
      setVisibility([...visibility, e.target.value])
    }
  }
  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setGrades([...['all'], ...GRADES.map((item) => item.toString())])
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
    setFilter({})
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
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              School Year
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  value='2021-2022'
                  checked={schoolYear.includes('2021-2022')}
                  onChange={handleChangeSchoolYear}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  2021-22
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  value='2022-2023'
                  checked={schoolYear.includes('2022-2023')}
                  onChange={handleChangeSchoolYear}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  2022-23
                </Paragraph>
              }
            />

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
                  Unhiden
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
