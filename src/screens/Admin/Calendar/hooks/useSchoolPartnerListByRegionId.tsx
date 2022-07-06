import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { CheckBoxListVM } from '../components/CheckBoxList/CheckBoxList'
import { GetSchoolsOfEnrollment } from '../../SiteManagement/SchoolPartner/services'

export const useSchoolPartnerListByRegionId = (regionId: number) => {
  const {
    loading,
    data: schoolOfEnrollments,
    error,
  } = useQuery(GetSchoolsOfEnrollment, {
    variables: {
      regionId: regionId,
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [schoolOfEnrollmentList, setSchoolOfEnrollmentList] = useState<CheckBoxListVM[]>([])

  useEffect(() => {
    if (schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion) {
      setSchoolOfEnrollmentList(
        schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion
          ?.filter((item: any) => !!item.active)
          .map((schoolOfEnroll: any) => ({
            label: schoolOfEnroll?.name,
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
