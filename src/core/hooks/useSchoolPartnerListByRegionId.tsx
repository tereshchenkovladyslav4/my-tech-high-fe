import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { CheckBoxListVM } from '@mth/screens/Admin/Calendar/components/CheckBoxList/CheckBoxList'
import { GetSchoolsOfEnrollment } from '@mth/screens/Admin/SiteManagement/SchoolPartner/services'

export const useSchoolPartnerListByRegionId = (
  regionId: number,
): {
  loading: boolean
  schoolOfEnrollmentList: unknown[]
  error: ApolloError | undefined
} => {
  const {
    loading,
    data: schoolOfEnrollments,
    error,
  } = useQuery(GetSchoolsOfEnrollment, {
    variables: {
      schoolPartnerArgs: {
        region_id: regionId,
        sort: null,
      },
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [schoolOfEnrollmentList, setSchoolOfEnrollmentList] = useState<CheckBoxListVM[]>([])

  useEffect(() => {
    if (schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion) {
      setSchoolOfEnrollmentList(
        schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion
          ?.filter((item: unknown) => !!item.active)
          .map((schoolOfEnroll: unknown) => ({
            label: schoolOfEnroll?.abbreviation,
            value: `${schoolOfEnroll?.school_partner_id}`,
          })),
      )
    }
  }, [schoolOfEnrollments])

  return {
    loading: loading,
    schoolOfEnrollmentList: schoolOfEnrollmentList,
    error: error,
  }
}
