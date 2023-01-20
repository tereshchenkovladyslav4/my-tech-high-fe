import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getReimbursementSchoolYearsByRegionId } from '@mth/graphql/queries/school-year'
import { SchoolYear } from '../models/school-year.model'

export const useReimbursementRequestSchoolYears = (
  regionId: number | undefined,
): {
  loading: boolean
  reimbursementSchoolYears: DropDownItem[]
  selectedYearId: number
  setSelectedYearId: (value: number) => void
  error: ApolloError | undefined
} => {
  const [dropdownItems, setDropdownItems] = useState<DropDownItem[]>([])
  const [selectedYearId, setSelectedYearId] = useState<number>(0)

  const { loading, data, error } = useQuery(getReimbursementSchoolYearsByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: !regionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.reimbursementRequestSchoolYears) {
      const schoolYearsArray: Array<DropDownItem> = []
      data.reimbursementRequestSchoolYears.map((item: SchoolYear): void => {
        if (new Date(item.date_begin) <= new Date() && new Date(item.date_end) >= new Date())
          setSelectedYearId(+item?.school_year_id)
        schoolYearsArray.push({
          label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')} Summary`,
          value: item.school_year_id,
        })
      })
      setDropdownItems(sortBy(schoolYearsArray, 'label'))
    }
  }, [loading, data])

  return { loading, reimbursementSchoolYears: dropdownItems, selectedYearId, setSelectedYearId, error }
}
