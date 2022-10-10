import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { Provider } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import { getProvidersQuery } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'

export const useProviders = (
  schoolYearId: number,
  searchField = '',
  isActive = true,
): {
  loading: boolean
  providers: Provider[]
  dropdownItems: DropDownItem[]
  checkBoxItems: CheckBoxListVM[]
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [dropdownItems, setDropdownItems] = useState<DropDownItem[]>([])
  const [checkBoxItems, setCheckBoxItems] = useState<CheckBoxListVM[]>([])
  const [providers, setProviders] = useState<Provider[]>([])

  const { loading, data, error, refetch } = useQuery(getProvidersQuery, {
    variables: {
      findProvidersInput: { schoolYearId, searchField, isActive },
    },
    skip: !schoolYearId,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.providers) {
      const { providers } = data
      setDropdownItems(
        providers.map((item: Provider) => ({
          value: item.id,
          label: item.name,
        })),
      )
      setCheckBoxItems(
        providers.map((item: Provider) => ({
          value: item.id.toString(),
          label: item.name,
        })),
      )
      setProviders(providers)
    }
  }, [loading, data])

  return {
    loading,
    providers,
    dropdownItems,
    checkBoxItems,
    error: error,
    refetch,
  }
}
