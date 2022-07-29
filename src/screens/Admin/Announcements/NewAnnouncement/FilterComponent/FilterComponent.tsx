import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE, RED } from '../../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { CheckBoxList } from '../../../Calendar/components/CheckBoxList'
import { defaultUserList } from '../../../Calendar/defaultValue'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { useCurrentGradeAndProgramByRegionId } from '../../../Calendar/hooks/useCurrentGradeAndProgram'
import { getSchoolYearsByRegionId } from '@screens/Admin/Dashboard/SchoolYear/SchoolYear'
import { useQuery } from '@apollo/client'
import moment from 'moment'

type FilterComponentProps = {
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
  grades,
  users,
  gradesInvalid,
  usersInvalid,
  setUsers,
  setGrades,
  setGradesInvalid,
  setUsersInvalid,
}: FilterComponentProps) => {

  const { me } = useContext(UserContext)
  const { loading, gradeList, programYearList } = useCurrentGradeAndProgramByRegionId(Number(me?.selectedRegionId), grades, setGrades)
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
            <CheckBoxList
              title={'Grades'}
              values={grades}
              setValues={(value) => {
                setGrades(value)
                setGradesInvalid(false)
              }}
              checkboxLists={gradeList}
              haveSelectAll={true}
            />
            {gradesInvalid && (
              <Subtitle size='small' color={RED} fontWeight='700'>
                Please select one at least
              </Subtitle>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <CheckBoxList
            title={'Users'}
            values={users}
            setValues={(value) => {
              setUsers(value)
              setUsersInvalid(false)
            }}
            checkboxLists={defaultUserList}
            haveSelectAll={false}
          />
          {usersInvalid && (
            <Subtitle size='small' color={RED} fontWeight='700'>
              Please select one at least
            </Subtitle>
          )}
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'grid' }}>
            <CheckBoxList
              title={'Program Year'}
              values={grades}
              setValues={(value) => {
                setGrades(value)
                setGradesInvalid(false)
              }}
              checkboxLists={programYearList}
              haveSelectAll={false}
            />
            {gradesInvalid && (
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
