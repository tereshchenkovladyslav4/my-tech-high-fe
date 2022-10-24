import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { getPeriods } from '@mth/screens/Admin/Curriculum/services'

export type Period = {
  id: number
  period: number
  category: string
  archived: boolean
}

export const usePeriods = (
  schoolYearId: number,
  archived?: boolean,
  keyword?: string,
  preSelectedIds?: number[],
): {
  loading: boolean
  periods: Period[]
  dropdownItems: DropDownItem[]
  checkBoxItems: CheckBoxListVM[]
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [dropdownItems, setDropdownItems] = useState<DropDownItem[]>([])
  const [checkBoxItems, setCheckBoxItems] = useState<CheckBoxListVM[]>([])
  const [periods, setPeriods] = useState<Period[]>([])

  const { loading, data, error, refetch } = useQuery(getPeriods, {
    variables: { school_year_id: +schoolYearId, archived, keyword },
    skip: !schoolYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.periods) {
      const { periods } = data
      setDropdownItems(
        (periods || []).map((item: Period) => ({
          label: `Period ${item.period} - ${item.category}`,
          value: item.id.toString(),
        })),
      )
      setCheckBoxItems(
        (periods || [])
          .filter((item: Period) => !item.archived || preSelectedIds?.includes(item.id))
          .map((item: Period) => ({
            label: `Period ${item.period} - ${item.category}`,
            value: item.id.toString(),
            disabled: item.archived,
          })),
      )
      setPeriods(periods || [])
    }
  }, [loading, data])

  return {
    loading,
    periods,
    dropdownItems,
    checkBoxItems,
    error: error,
    refetch,
  }
}
