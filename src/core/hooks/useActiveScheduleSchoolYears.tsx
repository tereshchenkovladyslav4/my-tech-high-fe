import { useEffect, useMemo, useState } from 'react'
import { ApolloError, useLazyQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { ScheduleStatus } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { getActiveScheduleSchoolYearsQuery } from '@mth/screens/Homeroom/Schedule/services'

export const useActiveScheduleSchoolYears = (
  studentId?: number | undefined,
  defaultSchoolYearId?: number,
): {
  loading: boolean
  schoolYears: SchoolYear[]
  dropdownItems: DropDownItem[]
  error: ApolloError | undefined
  refetchSchoolYear: () => void
  selectedYearId: number | undefined
  setSelectedYearId: (_?: number) => void
  selectedYear: SchoolYear | undefined
  activeScheduleYearId: number | undefined
} => {
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYear>>([])
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>()
  const [activeScheduleYearId, setActiveScheduleYearId] = useState<number | undefined>()

  const [getActiveScheduleSchoolYears, { loading, data, error, refetch }] = useLazyQuery(
    getActiveScheduleSchoolYearsQuery,
    {
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    if (studentId) {
      getActiveScheduleSchoolYears({
        variables: {
          studentId: studentId,
        },
      })
    }
  }, [studentId])

  useEffect(() => {
    if (data?.activeScheduleSchoolYears) {
      const { activeScheduleSchoolYears: schoolYears } = data
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
      const activeScheduleYear =
        currentYear?.ScheduleStatus === ScheduleStatus.SUBMITTED ||
        currentYear?.ScheduleStatus === ScheduleStatus.RESUBMITTED ||
        currentYear?.ScheduleStatus === ScheduleStatus.ACCEPTED
          ? currentYear
          : schoolYears.filter(
              (item) =>
                item.ScheduleStatus === ScheduleStatus.SUBMITTED || item.ScheduleStatus === ScheduleStatus.ACCEPTED,
            )[0]
      const defaultSchoolYear = schoolYears.filter((item) => item.school_year_id == defaultSchoolYearId)[0]
      setSelectedYearId(
        defaultSchoolYear?.school_year_id ||
          activeScheduleYear?.school_year_id ||
          currentYear?.school_year_id ||
          schoolYears.at(-1)?.school_year_id,
      )
      setActiveScheduleYearId(activeScheduleYear?.school_year_id)
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
    activeScheduleYearId,
  }
}
