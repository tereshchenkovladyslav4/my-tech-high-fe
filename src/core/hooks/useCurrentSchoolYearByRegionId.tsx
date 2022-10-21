import { ApolloError, useQuery } from '@apollo/client'
import { GetCurrentSchoolYearByRegionId } from '@mth/screens/Admin/Announcements/services'

export const useCurrentSchoolYearByRegionId = (
  regionId: number,
): {
  loading: boolean
  data: {
    grades: string
    RegionId: number
    date_begin: string
    date_end: string
    SchoolPartners: {
      abbreviation: string
      active: number
      school_partner_id: string
    }[]
    enrollment_packet: boolean
    midyear_application: boolean
    midyear_application_open: string
    midyear_application_close: string
    schedule: boolean
    diploma_seeking: boolean
    testing_preference: boolean
    school_year_id: number
    ScheduleBuilder: {
      split_enrollment: boolean
      always_unlock: boolean
      max_num_periods: number
    }
  }
  error: ApolloError | undefined
} => {
  const { loading, data, error } = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  return { loading: loading, data: data?.schoolyear_getcurrent, error: error }
}
