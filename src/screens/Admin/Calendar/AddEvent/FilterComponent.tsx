import React, { useContext, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Card, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { sortBy } from 'lodash'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useCurrentGradeAndProgramByRegionId, useCurrentSchoolYearByRegionId, useProviders } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { defaultUserList } from '../defaultValue'
import { calendarClassess } from '../styles'
import { EventFormData, FilterComponentProps } from '../types'
import { addEventClassess } from './styles'

type OtherType = {
  label: string
  value: string
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  others,
  providers,
  setOthers,
  setProviders,
  setIsChanged,
  isNew,
}) => {
  const { me } = useContext(UserContext)
  const { errors, setFieldValue, touched, values } = useFormikContext<EventFormData>()
  const { programYearList, gradeList, schoolPartnerList, testPreference } = useCurrentGradeAndProgramByRegionId(
    Number(me?.selectedRegionId),
  )
  const { data: currentSchoolYear } = useCurrentSchoolYearByRegionId(Number(me?.selectedRegionId))
  const { providers: providerList } = useProviders(currentSchoolYear?.school_year_id ?? 0)

  const [expand, setExpand] = useState<boolean>(true)
  const [showOtherFilters, setShowOtherFilters] = useState(false)
  const [otherList, setOtherList] = useState<OtherType[]>([])
  const [sortedGradeList, setSortedGradeList] = useState<string[]>([])

  const [selectAll, setSelectAll] = useState(false)
  const [curriculumProviders, setCurriculumProviders] = useState<CheckBoxListVM[]>([])

  useEffect(() => {
    if (providerList && providerList.length > 0) {
      setCurriculumProviders(
        providerList
          .filter((p) => p.is_display)
          .map((obj) => {
            return { label: obj.name, value: obj.id.toString() }
          }),
      )
    }
  }, [providerList])
  useEffect(() => {
    if (selectAll && programYearList && schoolPartnerList && gradeList) {
      setFieldValue('grades', ['all', ...sortedGradeList.map(({ value }) => value)])
      setFieldValue(
        'programYears',
        programYearList.map(({ value }) => value),
      )
      setFieldValue(
        'schoolOfEnrollments',
        schoolPartnerList.map(({ value }) => value),
      )
    }
  }, [selectAll])

  useEffect(() => {
    if (isNew) {
      setSelectAll(values.users.includes('1') || values.users.includes('2'))
    }
  }, [values.users])

  useEffect(() => {
    setShowOtherFilters(values.users.includes('1') || values.users.includes('2'))
  }, [values.users])

  useEffect(() => {
    let newList = []
    if (gradeList.length > 0) {
      newList = sortBy(gradeList, (a) => (parseFloat(a.value) ? parseFloat(a.value) : 0))
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
                values={values.programYears}
                checkboxLists={programYearList}
                haveSelectAll={false}
                setValues={(value) => {
                  setFieldValue('programYears', value)
                  setIsChanged(true)
                }}
                showError={(touched.programYears && errors.programYears) as boolean}
                error={<Subtitle sx={calendarClassess.formError}>{errors.programYears}</Subtitle>}
              />
              <MthCheckboxList
                title={'School of Enrollment'}
                values={values.schoolOfEnrollments}
                setValues={(value) => {
                  setFieldValue('schoolOfEnrollments', value)
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
                checkboxLists={curriculumProviders}
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
