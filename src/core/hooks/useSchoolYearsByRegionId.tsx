import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

export type SchoolYearRespnoseType = {
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
  schedule: boolean
  diploma_seeking: boolean
}

export const useSchoolYearsByRegionId = (
  regionId: number | undefined,
): {
  loading: boolean
  schoolYears: SchoolYearRespnoseType[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
  refetchSchoolYear: () => void
} => {
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYearRespnoseType>>([])

  const { loading, data, error, refetch } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: !regionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.region?.SchoolYears) {
      const { SchoolYears } = data?.region
      setDropdownItems(
        sortBy(SchoolYears, 'date_begin').map((item: SchoolYearRespnoseType) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
        })),
      )
      setSchoolYears(SchoolYears)
    }
  }, [loading, data])

  return {
    loading: loading,
    schoolYears: schoolYears,
    dropdownItems: dropdownItems,
    error: error,
    refetchSchoolYear: refetch,
  }
}
