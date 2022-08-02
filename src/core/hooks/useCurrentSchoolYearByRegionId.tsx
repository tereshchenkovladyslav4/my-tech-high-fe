import { ApolloError, useQuery } from '@apollo/client'
import { GetCurrentSchoolYearByRegionId } from '@mth/screens/Admin/Announcements/services'

export const useCurrentSchoolYearByRegionId = (
  regionId: number,
): {
  loading: boolean
  data: unknown
  error: ApolloError | undefined
} => {
  const { loading, data, error } = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  return { loading: loading, data: data, error: error }
}
