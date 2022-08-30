import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getActiveSchoolYearsByRegionId } from '@mth/graphql/queries/school-year'

type SchoolYearType = {
  school_year_id: number
  MainyearApplicatable: boolean
  date_begin: Date
  date_end: Date
  MidyearApplicatable: boolean
  grades: string
  birth_date_cut: string
}

export const useActiveSchoolYearsByRegionId = (
  regionId: number | undefined,
): {
  loading: boolean
  schoolYears: SchoolYearType[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
} => {
  const [dropdownItems, setDropdownItems] = useState<DropDownItem[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])

  const { loading, data, error } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: !regionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getActiveSchoolYears) {
      const schoolYearsArray: Array<DropDownItem> = []
      data.getActiveSchoolYears
        .filter((item: SchoolYearType) => moment(item.date_begin).format('YYYY') >= moment().format('YYYY'))
        .map((item: SchoolYearType): void => {
          if (item.MainyearApplicatable) {
            schoolYearsArray.push({
              label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
              value: item.school_year_id,
            })
          }

          if (item.MidyearApplicatable) {
            schoolYearsArray.push({
              label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format(
                'YY',
              )} Mid-year Program`,
              value: `${item.school_year_id}-mid`,
            })
          }
        })
      setDropdownItems(sortBy(schoolYearsArray, 'label'))
      setSchoolYears(data.getActiveSchoolYears)
    }
  }, [loading, data])

  return { loading, schoolYears, dropdownItems, error }
}
