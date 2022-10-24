import React, { useContext, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Card, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { map, sortBy } from 'lodash'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useCurrentGradeAndProgramByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { defaultProviderList, defaultUserList } from '../defaultValue'
import { calendarClassess } from '../styles'
import { EventFormData, FilterComponentProps } from '../types'
import { addEventClassess } from './styles'

type OtherType = {
  label: string
  value: string
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  programYears,
  schoolofEnrollments,
  others,
  providers,
  setGrades,
  setProgramYears,
  setSchoolofEnrollment,
  setOthers,
  setProviders,
  setIsChanged,
}) => {
  const { me } = useContext(UserContext)
  const { errors, setFieldValue, touched, values } = useFormikContext<EventFormData>()
  const { programYearList, gradeList, schoolPartnerList, testPreference } = useCurrentGradeAndProgramByRegionId(
    Number(me?.selectedRegionId),
  )

  const [expand, setExpand] = useState<boolean>(true)
  const [showOtherFilters, setShowOtherFilters] = useState(false)
  const [otherList, setOtherList] = useState<OtherType[]>([])
  const [sortedGradeList, setSortedGradeList] = useState<string[]>([])

  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    if (selectAll && programYearList && schoolPartnerList && gradeList) {
      setProgramYears(map(programYearList, (el) => el.value))
      setSchoolofEnrollment(map(schoolPartnerList, (el) => el.value))
      if (values.grades.length === 0) setGrades(['all', ...map(gradeList, (el) => el.value)])
    }
  }, [selectAll])

  useEffect(() => {
    setSelectAll(values.users.includes('1') || values.users.includes('2'))
  }, [values.users])

  useEffect(() => {
    setShowOtherFilters(values.users.includes('1') || values.users.includes('2'))
  }, [values.users])

  useEffect(() => {
    let newList = []
    if (gradeList.length > 0) {
      newList = sortBy(gradeList, (a) => (parseFloat(a.value) ? parseFloat(a.value) : 0))
      newList.splice(0, 0, newList.pop())
      setSortedGradeList(newList)
    }
  }, [gradeList])

  useEffect(() => {
    const defaultList = [
      {
        label: 'Diploma-seeking',
        value: 'diploma-seeking',
      },
      {
        label: 'Non Diploma-seeking',
        value: 'non-diploma-seeking',
      },
    ]
    if (testPreference) {
      defaultList.push(
        {
          label: 'Testing Opt-in',
          value: 'testing-opt-in',
        },
        {
          label: 'Testing Opt-out',
          value: 'testing-opt-out',
        },
      )
    }
    setOtherList(defaultList)
  }, [testPreference, me?.selectedRegionId])

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
              values={values.users}
              setValues={(value) => {
                setFieldValue('users', value)
                setIsChanged(true)
              }}
              checkboxLists={defaultUserList}
              haveSelectAll={false}
              showError={(touched.users && errors.users) as boolean}
              error={<Subtitle sx={calendarClassess.formError}>{errors.users}</Subtitle>}
            />
            {showOtherFilters && (
              <>
                <MthCheckboxList
                  title={'Grade Level'}
                  values={values.grades}
                  setValues={(value) => {
                    setFieldValue('grades', value)
                    setIsChanged(true)
                  }}
                  checkboxLists={sortedGradeList}
                  haveSelectAll={true}
                  showError={(touched.grades && errors.grades) as boolean}
                  error={<Subtitle sx={calendarClassess.formError}>{errors.grades}</Subtitle>}
                />
              </>
            )}
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
                checkboxLists={otherList}
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
