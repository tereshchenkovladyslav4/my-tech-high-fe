import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { getRegion } from '@mth/graphql/queries/region'
import { RegionDetail } from '@mth/providers/UserContext/types'

export const useRegionByRegionId = (
  regionId: number | undefined,
): {
  loading: boolean
  region: RegionDetail | undefined
  error: ApolloError | undefined
} => {
  const [region, setRegion] = useState<RegionDetail>()

  const { loading, data, error } = useQuery(getRegion, {
    variables: {
      id: regionId,
    },
    skip: !regionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.region) {
      setRegion(data?.region)
    }
  }, [loading, data])

  return { loading: loading, region: region, error: error }
}
