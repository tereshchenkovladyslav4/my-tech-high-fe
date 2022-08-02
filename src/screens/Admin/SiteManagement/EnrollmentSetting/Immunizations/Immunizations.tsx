import React, { createContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button } from '@mui/material'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { getSettingsQuery, updateSettingsMutation } from '../../../EnrollmentPackets/services'
import ImminizationSettings from './ImminizationSettings/ImminizationSettings'
import ImmunizationHeader from './ImmunizationHeader'
import ImmunizationItems from './ImmunizationItems/ImmunizationItems'
import { getImmunizationSettings, getSchoolYears } from './services'

export interface ImmunizationsData {
  id?: number
  title?: string
  min_grade_level?: string
  max_grade_level?: string
  min_school_year_required?: number
  max_school_year_required?: number
  immunity_allowed?: number
  exempt_update?: number
  level_exempt_update?: string
  consecutive_vaccine?: number
  min_spacing_date?: number | null
  min_spacing_interval?: number | null
  max_spacing_date?: number | null
  max_spacing_interval?: number | null
  email_update_template?: string | null
  tooltip?: string
  is_enabled?: boolean
  order?: number
  consecutives?: number[]
  is_deleted?: boolean
}

export interface SchoolYears {
  school_year_id: string
  date_begin: string
  date_end: string
}

export const YearsContext = createContext(null)

export const DataContext = createContext(null)

const Immunizations: React.FC = () => {
  const { path, isExact } = useRouteMatch('/site-management/enrollment/immunizations')
  const history = useHistory()
  const { loading, error, data, refetch } = useQuery<{ immunizationSettings: { results: ImmunizationsData[] } }>(
    getImmunizationSettings,
    {
      fetchPolicy: 'network-only',
    },
  )

  const settingsQuery = useQuery(getSettingsQuery)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(settingsQuery.data?.settings?.enable_immunizations === 1)
  }, [settingsQuery.data])

  const [updateSettings] = useMutation(updateSettingsMutation)

  const {
    data: yearsData,
    loading: yearsLoading,
    error: yearsError,
  } = useQuery<{ schoolYears: SchoolYears[] }>(getSchoolYears)

  if (loading || yearsLoading) return null
  if (error || yearsError) {
    console.error(error || yearsError)
    return null
  }
  const {
    immunizationSettings: { results },
  } = data

  return (
    <Box
      width='95%'
      marginX='auto'
      marginY='13px'
      bgcolor='white'
      borderRadius='12px'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'start',
        paddingY: '30px',
      }}
    >
      {isExact && (
        <>
          <ImmunizationHeader
            enabledState={enabled}
            withSave={false}
            title='Immunization Settings'
            onEnabledChange={async (v) => {
              setEnabled(v)
              await updateSettings({
                variables: {
                  input: { enable_immunizations: v ? 1 : 0 },
                },
              })
              refetch()
            }}
            backUrl='/site-management/enrollment/'
          />
          <ImmunizationItems enabled={enabled} data={results} refetch={refetch} />
          <Button
            onClick={() => history.push('/site-management/enrollment/immunizations/add')}
            sx={{
              background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF',
              color: 'white',
              width: '210px',
              marginLeft: '40px',
              marginTop: '40px',
              '&:hover': {
                backgroundColor: '#4145FF',
              },
              borderRadius: '8px',
            }}
            startIcon={<AddIcon />}
          >
            Add Immunization
          </Button>
        </>
      )}
      <Switch>
        <Route path={`${path}/:id`}>
          <YearsContext.Provider value={yearsData.schoolYears}>
            <DataContext.Provider value={results}>
              <ImminizationSettings data={results} refetch={refetch} />
            </DataContext.Provider>
          </YearsContext.Provider>
        </Route>
      </Switch>
    </Box>
  )
}

export { Immunizations as default }
