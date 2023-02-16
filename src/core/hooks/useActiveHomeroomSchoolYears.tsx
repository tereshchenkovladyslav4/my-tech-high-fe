import { useEffect, useMemo, useState } from 'react'
import { ApolloError, useLazyQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { getActiveStudentHomeroomSchoolYearsQuery } from '@mth/graphql/queries/school-year'
import { SchoolYear } from '@mth/models'

export const useActiveHomeroomSchoolYears = (
  studentId?: number | undefined,
): {
  loading: boolean
  schoolYears: SchoolYear[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
  refetchSchoolYear: () => void
  selectedYearId: number | undefined
  setSelectedYearId: (_?: number) => void
  selectedYear: SchoolYear | undefined
} => {
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYear>>([])
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>()

  const [getActiveHomeroomSchoolYears, { loading, data, error, refetch }] = useLazyQuery(
    getActiveStudentHomeroomSchoolYearsQuery,
    {
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    if (studentId) {
      getActiveHomeroomSchoolYears({
        variables: {
          studentId: studentId,
        },
      })
    }
  }, [studentId])

  useEffect(() => {
    if (data?.activeHomeroomSchoolYears) {
      const { activeHomeroomSchoolYears: schoolYears } = data
      setDropdownItems(
        sortBy(schoolYears, 'date_begin').map((item: SchoolYear) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
        })),
      )
      setSchoolYears(schoolYears)
    }
  }, [loading, data])

  useEffect(() => {
    if (schoolYears?.length) {
      const currentYear = schoolYears.filter((item) => item.IsCurrentYear)[0]
      setSelectedYearId(currentYear?.school_year_id)
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
