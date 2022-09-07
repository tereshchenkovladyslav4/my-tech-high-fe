import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid } from '@mui/material'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import {
  DEFAULT_OPT_OUT_FORM_DESCRIPTION,
  DEFAULT_OPT_OUT_FORM_TITLE,
  DEFAULT_TESTING_PREFERENCE_DESCRIPTION,
  DEFAULT_TESTING_PREFERENCE_TITLE,
  OPT_OUT,
  TESTING_PREFERENCE,
} from '@mth/constants'
import { MthRoute, MthTitle } from '@mth/enums'
import { getAssessmentsBySchoolYearId } from '@mth/graphql/queries/assessment'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { AssessmentEditForm } from './AssessmentEditForm'
import AssessmentTable from './AssessmentTable'
import HeaderComponent from './HeaderComponent'
import { testingPreferenceClassess } from './styles'
import TestingPreferenceInformation from './TestingPreferenceInformation'
import { AssessmentType, Information } from './types'

const TestingPreference: React.FC = () => {
  const { me } = useContext(UserContext)
  const { path, isExact } = useRouteMatch(MthRoute.TESTING_PREFERENCE_PATH) || {}
  const history = useHistory()
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<number>(0)
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [informations, setInformations] = useState<Information[]>([])
  const [availGrades, setAvailableGrades] = useState<(string | number)[]>([])
  const [assessmentItems, setAssessmentItems] = useState<AssessmentType[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType>()
  const { data, loading, refetch } = useQuery(getAssessmentsBySchoolYearId, {
    variables: {
      schoolYearId: selectedSchoolYear,
    },
    skip: selectedSchoolYear ? false : true,
    fetchPolicy: 'network-only',
  })
  const {
    dropdownItems: schoolYearDropdownItems,
    schoolYears: schoolYears,
    refetchSchoolYear,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  useEffect(() => {
    if (schoolYears?.length && selectedSchoolYear == 0) {
      setSelectedSchoolYear(Number(schoolYears[0].school_year_id))
    }
    if (selectedSchoolYear > 0) {
      const infoArray: Information[] = []
      schoolYears
        .filter((schoolYear) => Number(schoolYear.school_year_id) == selectedSchoolYear)
        .map((schoolYear) => {
          setAvailableGrades(schoolYear.grades?.split(','))
          infoArray.push({
            schoolYear: Number(schoolYear.school_year_id),
            type: TESTING_PREFERENCE,
            title: schoolYear.testing_preference_title || DEFAULT_TESTING_PREFERENCE_TITLE,
            description: schoolYear.testing_preference_description || DEFAULT_TESTING_PREFERENCE_DESCRIPTION,
          })
          infoArray.push({
            schoolYear: Number(schoolYear.school_year_id),
            type: OPT_OUT,
            title: schoolYear.opt_out_form_title || DEFAULT_OPT_OUT_FORM_TITLE,
            description: schoolYear.opt_out_form_description || DEFAULT_OPT_OUT_FORM_DESCRIPTION,
          })
        })
      setInformations(infoArray)
    }
  }, [schoolYears, selectedSchoolYear])

  useEffect(() => {
    if (!loading && data?.getAssessmentsBySchoolYearId) {
      const items = data?.getAssessmentsBySchoolYearId
      setAssessmentItems(items.map((item: AssessmentType) => ({ ...item, assessment_id: Number(item.assessment_id) })))
    }
  }, [data, loading])

  return (
    <Box sx={testingPreferenceClassess.container}>
      {isExact && (
        <>
          <HeaderComponent
            dropDownItems={schoolYearDropdownItems}
            selectedSchoolYear={selectedSchoolYear}
            setSelectedSchoolYear={setSelectedSchoolYear}
          />
          <Box sx={{ paddingX: 8, marginTop: 5 }}>
            <Grid container sx={{ textAlign: 'left' }}>
              {informations?.map((information, index) => (
                <Grid key={index} item xs={6}>
                  <TestingPreferenceInformation information={information} refetch={refetchSchoolYear} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={testingPreferenceClassess.buttonGroup}>
            <Button
              variant='contained'
              disableElevation
              sx={showArchived ? testingPreferenceClassess.activeButton : testingPreferenceClassess.inactiveButton}
              onClick={() => setShowArchived(true)}
            >
              {MthTitle.SHOW_ARCHIVED}
            </Button>
            <Button
              variant='contained'
              disableElevation
              sx={showArchived ? testingPreferenceClassess.inactiveButton : testingPreferenceClassess.activeButton}
              onClick={() => setShowArchived(false)}
            >
              {MthTitle.HIDE_ARCHIVED}
            </Button>
          </Box>
          <AssessmentTable
            assessmentItems={assessmentItems?.filter((item) => item.is_archived == showArchived)}
            setAssessmentItems={setAssessmentItems}
            setSelectedAssessment={setSelectedAssessment}
            refetch={refetch}
          />
          <Button
            onClick={() => {
              setSelectedAssessment(undefined)
              history.push(`${MthRoute.TESTING_PREFERENCE_PATH}/add`)
            }}
            sx={testingPreferenceClassess.addBtn}
            startIcon={<AddIcon />}
          >
            {MthTitle.ADD_ASSESSMENT}
          </Button>
        </>
      )}
      <Switch>
        <Route path={`${path}/:id`}>
          <AssessmentEditForm
            assessment={selectedAssessment}
            selectedYear={selectedSchoolYear}
            availGrades={availGrades}
            refetch={refetch}
          />
        </Route>
      </Switch>
    </Box>
  )
}

export default TestingPreference
