import React, { useContext, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Card, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useCurrentGradeAndProgramByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { defaultOtherList, defaultProviderList, defaultUserList } from '../defaultValue'
import { calendarClassess } from '../styles'
import { EventFormData, FilterComponentProps } from '../types'
import { addEventClassess } from './styles'

const FilterComponent: React.FC<FilterComponentProps> = ({
  programYears,
  users,
  schoolofEnrollments,
  others,
  providers,
  setGrades,
  setProgramYears,
  setUsers,
  setSchoolofEnrollment,
  setOthers,
  setProviders,
  setIsChanged,
}) => {
  const { me } = useContext(UserContext)
  const { errors, setFieldValue, touched, values } = useFormikContext<EventFormData>()
  const { programYearList, gradeList, schoolPartnerList } = useCurrentGradeAndProgramByRegionId(
    Number(me?.selectedRegionId),
    setGrades,
  )
  const [expand, setExpand] = useState<boolean>(true)
  const [showOtherFilters, setShowOtherFilters] = useState(false)

  useEffect(() => {
    setShowOtherFilters(users.includes('1') || users.includes('2'))
  }, [users])

  const chevron = () =>
    !expand ? (
      <ChevronRightIcon
        sx={{
          color: MthColor.MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
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
  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <Box sx={addEventClassess.container}>
            <MthCheckboxList
              title={'Users'}
              values={users}
              setValues={(value) => {
                setUsers(value)
                setIsChanged(true)
              }}
              checkboxLists={defaultUserList}
              haveSelectAll={false}
            />
            <Subtitle sx={calendarClassess.formError}>{touched.grades && errors.grades}</Subtitle>
            <MthCheckboxList
              title={'Grade Level'}
              values={values.grades}
              setValues={(value) => {
                setFieldValue('grades', value)
                setIsChanged(true)
              }}
              checkboxLists={gradeList}
              haveSelectAll={true}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          {showOtherFilters && (
            <Box sx={addEventClassess.container}>
              <MthCheckboxList
                title={'Program Year'}
                values={programYears}
                setValues={(value) => {
                  setProgramYears(value)
                  setIsChanged(true)
                }}
                checkboxLists={programYearList}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title={'School of Enrollment'}
                values={schoolofEnrollments}
                setValues={(value) => {
                  setSchoolofEnrollment(value)
                  setIsChanged(true)
                }}
                checkboxLists={schoolPartnerList}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title={'Other'}
                values={others}
                setValues={(value) => {
                  setOthers(value)
                  setIsChanged(true)
                }}
                checkboxLists={defaultOtherList}
                haveSelectAll={false}
              />
              <MthCheckboxList
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
          )}
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <Card sx={addEventClassess.card}>
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

export default FilterComponent
