import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

type SchoolYearType = {
  school_year_id: number
  date_begin: Date
  date_end: Date
  label?: string
}

export const useSchoolYearsByRegionId = (
  regionId: number | undefined,
): {
  loading: boolean
  schoolYears: SchoolYearType[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
} => {
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYearType>>([])

  const { loading, data, error } = useQuery(getSchoolYearsByRegionId, {
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
        SchoolYears.map((item: SchoolYearType) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
        })),
      )
      setSchoolYears(SchoolYears)
    }
  }, [loading, data])

  return { loading: loading, schoolYears: schoolYears, dropdownItems: dropdownItems, error: error }
}
