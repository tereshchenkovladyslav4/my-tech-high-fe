import { Box, Card, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE, RED } from '../../../../utils/constants'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FilterComponentProps } from '../types'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { CheckBoxList } from '../components/CheckBoxList'
import { useStyles } from '../components/CheckBoxList/styles'
import { defaultOtherList, defaultProviderList, defaultUserList } from '../defaultValue'
import { useSchoolPartnerListByRegionId } from '../hooks/useSchoolPartnerListByRegionId'
import { useCurrentGradeAndProgramByRegionId } from '../hooks/useCurrentGradeAndProgram'

const FilterComponent = ({
  grades,
  programYears,
  users,
  schoolofEnrollments,
  others,
  providers,
  invalidOption,
  setInvalidOption,
  setGrades,
  setProgramYears,
  setUsers,
  setSchoolofEnrollment,
  setOthers,
  setProviders,
  setIsChanged,
}: FilterComponentProps) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const { loading, programYearList, gradeList } = useCurrentGradeAndProgramByRegionId(
    Number(me?.selectedRegionId),
    grades,
    setGrades,
  )
  const {
    loading: schoolOfEnrollmentLoading,
    schoolOfEnrollmentList,
    error: schoolOfEnrollmentError,
  } = useSchoolPartnerListByRegionId(Number(me?.selectedRegionId))
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
          <Box sx={classes.container}>
            <CheckBoxList
              title={'Grade Level'}
              values={grades}
              setValues={(value) => {
                setGrades(value)
                setIsChanged(true)
              }}
              checkboxLists={gradeList}
              haveSelectAll={true}
            />
            {invalidOption?.gradeFilter.status && (
              <Subtitle size={'small'} sx={{ color: RED, width: '65%' }}>
                {invalidOption?.gradeFilter.message}
              </Subtitle>
            )}
            <CheckBoxList
              title={'Program Year'}
              values={programYears}
              setValues={(value) => {
                setProgramYears(value)
                setIsChanged(true)
              }}
              checkboxLists={programYearList}
              haveSelectAll={false}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={classes.container}>
            <CheckBoxList
              title={'Users'}
              values={users}
              setValues={(value) => {
                setUsers(value)
                setIsChanged(true)
              }}
              checkboxLists={defaultUserList}
              haveSelectAll={false}
            />
            <CheckBoxList
              title={'Shool of Enrollment'}
              values={schoolofEnrollments}
              setValues={(value) => {
                setSchoolofEnrollment(value)
                setIsChanged(true)
              }}
              checkboxLists={schoolOfEnrollmentList}
              haveSelectAll={false}
            />
            <CheckBoxList
              title={'Other'}
              values={others}
              setValues={(value) => {
                setOthers(value)
                setIsChanged(true)
              }}
              checkboxLists={defaultOtherList}
              haveSelectAll={false}
            />
            <CheckBoxList
              title={'Providers'}
              values={providers}
              setValues={(value) => {
                setProviders(value)
                setIsChanged(true)
              }}
              checkboxLists={defaultProviderList}
              haveSelectAll={false}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )

  useEffect(() => {
    if (grades?.length > 0) {
      setInvalidOption({ ...invalidOption, gradeFilter: { status: false, message: '' } })
    } else {
      setInvalidOption({
        ...invalidOption,
        gradeFilter: { status: true, message: 'At least one Grade Level must be selected' },
      })
    }
  }, [grades])

  return (
    <Card sx={classes.card} >
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

export default FilterComponent
