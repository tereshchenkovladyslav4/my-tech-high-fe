import { useEffect, useState, useContext, useMemo } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

type ScheduleBuilder = {
  max_num_periods: number
}

export type SchoolYearResponseType = {
  school_year_id: number
  date_begin: string
  date_end: string
  label?: string
  midyear_application: boolean
  midyear_application_open: string
  midyear_application_close: string
  testing_preference_title: string
  testing_preference_description: string
  opt_out_form_title: string
  opt_out_form_description: string
  grades: string
  date_reg_open: string
  date_reg_close: string
  schedule_builder_open: string
  schedule_builder_close: string
  second_semester_open: string
  second_semester_close: string
  midyear_schedule_open: string
  midyear_schedule_close: string
  homeroom_resource_open: string
  homeroom_resource_close: string
  schedule: boolean
  diploma_seeking: boolean
  ScheduleBuilder?: ScheduleBuilder
}

export const useSchoolYearsByRegionId = (
  regionId?: number | undefined,
): {
  loading: boolean
  schoolYears: SchoolYearResponseType[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
  refetchSchoolYear: () => void
  selectedYearId: number | undefined
  setSelectedYearId: (_?: number) => void
  selectedYear: SchoolYearResponseType | undefined
} => {
  const { me } = useContext(UserContext)
  const selectedRegionId = regionId || me?.selectedRegionId
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYearResponseType>>([])
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>()

  const { loading, data, error, refetch } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: selectedRegionId,
    },
    skip: !selectedRegionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.region?.SchoolYears) {
      const { SchoolYears } = data?.region
      setDropdownItems(
        sortBy(SchoolYears, 'date_begin').map((item: SchoolYearResponseType) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
        })),
      )
      setSchoolYears(SchoolYears)
    }
  }, [loading, data])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYearId(schoolYears[0].school_year_id)
  }, [schoolYears])

  const selectedYear = useMemo(() => {
    if (selectedYearId && schoolYears.length) {
      return schoolYears.find((item) => item.school_year_id == selectedYearId)
    } else return undefined
  }, [selectedYearId, schoolYears])

  return {
    loading: loading,
    schoolYears: schoolYears,
    dropdownItems,
    error: error,
    refetchSchoolYear: refetch,
    selectedYearId,
    setSelectedYearId,
    selectedYear,
  }
}
