import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE, RED } from '../../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'

type FilterComponentProps = {
  availableGrades: (string | number)[]
  grades: string[]
  users: string[]
  gradesInvalid: boolean
  usersInvalid: boolean
  setUsers: (value: string[]) => void
  setGrades: (value: string[]) => void
  setGradesInvalid: (value: boolean) => void
  setUsersInvalid: (value: boolean) => void
}

const FilterComponent = ({
  availableGrades,
  grades,
  users,
  gradesInvalid,
  usersInvalid,
  setUsers,
  setGrades,
  setGradesInvalid,
  setUsersInvalid,
}: FilterComponentProps) => {
  const [expand, setExpand] = useState<boolean>(true)
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
  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setGrades([...['all'], ...availableGrades.map((item) => item.toString())])
      setGradesInvalid(false)
    } else {
      setGrades([])
      setGradesInvalid(true)
    }
  }
  const handleChangeGrades = (e) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGrades([...grades, e.target.value])
    }
    setGradesInvalid(false)
  }
  const renderGrades = () =>
    map(availableGrades, (grade, index) => {
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

  const handleChangeUsers = (e) => {
    if (users.includes(e.target.value)) {
      setUsers(users.filter((item) => item !== e.target.value))
      setUsersInvalid(false)
    } else {
      setUsers([...users, e.target.value])
      setUsersInvalid(false)
    }
  }
  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Grades
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
            {gradesInvalid && (
              <Subtitle size='small' color={RED} fontWeight='700'>
                Please select one at least
              </Subtitle>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'grid' }}>
            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Users
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='1' checked={users.includes('1')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Parents/Observers
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='2' checked={users.includes('2')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Students
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='3' checked={users.includes('3')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Teachers & Assistants
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='0' checked={users.includes('0')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Admin
                </Paragraph>
              }
            />
            {usersInvalid && (
              <Subtitle size='small' color={RED} fontWeight='700'>
                Please select one at least
              </Subtitle>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <>
      <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
        <Subtitle fontWeight='700' color={MTHBLUE} sx={{ cursor: 'pointer' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && Filters()}
    </>
  )
}

export default FilterComponent
