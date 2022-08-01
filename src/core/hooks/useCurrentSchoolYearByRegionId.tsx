import { useQuery } from '@apollo/client'
import { GetCurrentSchoolYearByRegionId } from '@mth/screens/Admin/Announcements/services'

export const useCurrentSchoolYearByRegionId = (regionId: number) => {
  const { loading, data, error } = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  return { loading: loading, data: data, error: error }
}
