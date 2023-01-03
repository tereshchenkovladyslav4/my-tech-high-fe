import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { getResourcesQuery } from '@mth/graphql/queries/resource'
import { HomeroomResource } from '@mth/models'

export const useResources = (
  schoolYearId: number,
): {
  loading: boolean
  resources: HomeroomResource[]
  checkBoxItems: CheckBoxListVM[]
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [checkBoxItems, setCheckBoxItems] = useState<CheckBoxListVM[]>([])
  const [resources, setResources] = useState<HomeroomResource[]>([])

  const { loading, data, error, refetch } = useQuery(getResourcesQuery, {
    variables: { schoolYearId: +schoolYearId },
    skip: !schoolYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.resources) {
      const { resources } = data
      setCheckBoxItems(
        (resources || [])
          // .filter((item) => !!item.is_active)
          .map((item: HomeroomResource) => ({
            label: item.title,
            value: item.resource_id?.toString(),
          })),
      )
      setResources(resources || [])
    }
  }, [loading, data])

  return {
    loading,
    resources,
    checkBoxItems,
    error: error,
    refetch,
  }
}
