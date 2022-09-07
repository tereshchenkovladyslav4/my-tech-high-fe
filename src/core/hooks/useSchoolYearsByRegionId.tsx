import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

type SchoolYearType = {
  school_year_id: number
  date_begin: Date
  date_end: Date
  label?: string
  midyear_application: boolean
  midyear_application_open: Date
  midyear_application_close: Date
  testing_preference_title: string
  testing_preference_description: string
  opt_out_form_title: string
  opt_out_form_description: string
  grades: string
}

export const useSchoolYearsByRegionId = (
  regionId: number | undefined,
): {
  loading: boolean
  schoolYears: SchoolYearType[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
  refetchSchoolYear: () => void
} => {
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYearType>>([])

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
        sortBy(SchoolYears, 'date_begin').map((item: SchoolYearType) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
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
