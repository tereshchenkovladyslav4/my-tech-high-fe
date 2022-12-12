import React, { useContext, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Grid } from '@mui/material'
import { map } from 'lodash'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useCurrentGradeAndProgramByRegionId, useCurrentSchoolYearByRegionId, useProviders } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { defaultUserList } from '../../../Calendar/defaultValue'

type OtherType = {
  label: string
  value: string
}

type FilterComponentProps = {
  grades: string[]
  users: string[]
  programYears: string[]
  schoolPartners: string[]
  others: string[]
  providers: string[]
  gradesInvalid: boolean
  usersInvalid: boolean
  schoolPartnersInvalid: boolean
  programYearsInvalid: boolean
  setOthers: (value: string[]) => void
  setProviders: (value: string[]) => void
  setUsers: (value: string[]) => void
  setGrades: (value: string[]) => void
  setGradesInvalid: (value: boolean) => void
  setUsersInvalid: (value: boolean) => void
  setProgramYears: (value: string[]) => void
  setSchoolPartners: (value: string[]) => void
  setProgramYearsInvalid: (value: boolean) => void
  setSchoolPartnersInvalid: (value: boolean) => void
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  grades,
  users,
  programYears,
  schoolPartners,
  gradesInvalid,
  usersInvalid,
  others,
  providers,
  setOthers,
  setProviders,
  setUsers,
  setGrades,
  setGradesInvalid,
  setUsersInvalid,
  setProgramYears,
  setProgramYearsInvalid,
  setSchoolPartners,
  setSchoolPartnersInvalid,
}) => {
  const { me } = useContext(UserContext)

  const { data: currentSchoolYear } = useCurrentSchoolYearByRegionId(Number(me?.selectedRegionId))
  const { providers: providerList } = useProviders(currentSchoolYear?.school_year_id ?? 0)

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
    setSelectAll(users?.includes('1') || users?.includes('2'))
  }, [users])

  useEffect(() => {
    if (selectAll && programYearList && schoolPartnerList && gradeList) {
      setProgramYears(map(programYearList, (el) => el.value))
      setSchoolPartners(map(schoolPartnerList, (el) => el.value))
      if (grades.length === 0) setGrades(['all', ...map(gradeList, (el) => el.value)])
    }
  }, [selectAll])

  useEffect(() => {
    setShowOtherFilters(users.includes('1') || users.includes('2'))
  }, [users])

  useEffect(() => {
    if (grades.length !== 0) setGradesInvalid(false)
  }, [grades])

  const { gradeList, programYearList, schoolPartnerList, testPreference } = useCurrentGradeAndProgramByRegionId(
    Number(me?.selectedRegionId),
  )
  const [expand, setExpand] = useState<boolean>(true)
  const [showOtherFilters, setShowOtherFilters] = useState(false)
  const [otherList, setOtherList] = useState<OtherType[]>([])

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
          <MthCheckboxList
            title={'Users'}
            values={users}
            setValues={(value) => {
              setUsers(value)
              setUsersInvalid(false)
            }}
            checkboxLists={defaultUserList}
            haveSelectAll={false}
            showError={usersInvalid}
            error='Users Required'
          />
          {showOtherFilters && (
            <MthCheckboxList
              title={'Grades'}
              values={grades}
              setValues={(value) => {
                setGrades(value)
                setGradesInvalid(false)
              }}
              checkboxLists={gradeList}
              haveSelectAll={true}
              showError={gradesInvalid}
              error='Grades Required'
            />
          )}
        </Grid>
        <Grid item xs={6}>
          {showOtherFilters && (
            <>
              <MthCheckboxList
                title={'Program Year'}
                values={programYears}
                setValues={(value) => {
                  setProgramYears(value)
                  setProgramYearsInvalid(false)
                }}
                checkboxLists={programYearList}
                haveSelectAll={false}
              />

              <MthCheckboxList
                title={'School of Enrollment'}
                values={schoolPartners}
                setValues={(value) => {
                  setSchoolPartners(value)
                  setSchoolPartnersInvalid(false)
                }}
                checkboxLists={schoolPartnerList}
                haveSelectAll={false}
              />

              <MthCheckboxList
                title={'Other'}
                values={others}
                setValues={(value) => {
                  setOthers(value)
                }}
                checkboxLists={otherList}
                haveSelectAll={false}
              />

              <MthCheckboxList
                title={'Providers'}
                values={providers}
                setValues={(value) => {
                  setProviders(value)
                }}
                checkboxLists={curriculumProviders}
                haveSelectAll={false}
              />
            </>
          )}
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </Grid>
  )

  return (
    <>
      <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
        <Subtitle fontWeight='700' color={MthColor.MTHBLUE} sx={{ cursor: 'pointer' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && Filters()}
    </>
  )
}

export default FilterComponent
