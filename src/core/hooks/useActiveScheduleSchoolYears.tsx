import { useEffect, useState, useMemo } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getActiveScheduleSchoolYearsQuery } from '@mth/screens/Homeroom/Schedule/services'
import { SchoolYearResponseType } from './useSchoolYearsByRegionId'

export const useActiveScheduleSchoolYears = (
  studentId?: number | undefined,
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
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYearResponseType>>([])
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>()

  const { loading, data, error, refetch } = useQuery(getActiveScheduleSchoolYearsQuery, {
    variables: {
      studentId: studentId,
    },
    skip: !studentId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.activeScheduleSchoolYears) {
      const { activeScheduleSchoolYears: schoolYears } = data
      setDropdownItems(
        sortBy(schoolYears, 'date_begin').map((item: SchoolYearResponseType) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
        })),
      )
      setSchoolYears(schoolYears)
    }
  }, [loading, data])

  useEffect(() => {
    if (schoolYears?.length) {
      setSelectedYearId(schoolYears[0].school_year_id)
    } else {
      setSelectedYearId(undefined)
    }
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
