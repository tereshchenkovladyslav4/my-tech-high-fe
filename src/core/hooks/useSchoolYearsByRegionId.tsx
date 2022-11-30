import { useEffect, useState, useContext, useMemo } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

export const useSchoolYearsByRegionId = (
  regionId?: number | undefined,
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
  const { me } = useContext(UserContext)
  const selectedRegionId = regionId || me?.selectedRegionId
  const [dropdownItems, setDropdownItems] = useState<Array<DropDownItem>>([])
  const [schoolYears, setSchoolYears] = useState<Array<SchoolYear>>([])
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
        sortBy(SchoolYears, 'date_begin').map((item: SchoolYear) => ({
          value: item.school_year_id,
          label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
        })),
      )
      setSchoolYears(SchoolYears)
    }
  }, [loading, data])

  useEffect(() => {
    if (schoolYears?.length) {
      const currentYear = schoolYears.filter((item) => item.IsCurrentYear)[0]
      setSelectedYearId(currentYear?.school_year_id || schoolYears[0].school_year_id)
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
