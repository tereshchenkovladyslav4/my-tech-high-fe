import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { CheckBoxListVM } from '@mth/components/MthCheckBoxList/types'
import { GetSchoolsOfEnrollment } from '@mth/screens/Admin/SiteManagement/SchoolPartner/services'

export const useSchoolPartnerListByRegionIdAndSchoolYearId = (
  regionId: number,
  school_year_id = 0,
): {
  loading: boolean
  schoolOfEnrollmentList: CheckBoxListVM[]
  selectedSchoolofEnrollments: string[]
  setSelectedSchoolofEnrollments: (value: string[]) => void
  error: ApolloError | undefined
} => {
  const [schoolofEnrollments, setSchoolofEnrollments] = useState<string[]>([])
  const {
    loading,
    data: schoolOfEnrollments,
    error,
  } = useQuery(GetSchoolsOfEnrollment, {
    variables: {
      schoolPartnerArgs: {
        region_id: regionId,
        sort: school_year_id ? { column: 'name', direction: 'ASC' } : null,
        school_year_id: school_year_id,
      },
    },
    skip: !regionId || !school_year_id,
    fetchPolicy: 'network-only',
  })

  const [schoolOfEnrollmentList, setSchoolOfEnrollmentList] = useState<CheckBoxListVM[]>([])

  useEffect(() => {
    if (schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion) {
      setSchoolOfEnrollmentList(
        schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion
          ?.filter((item: { active: boolean }) => !!item.active)
          .map((schoolOfEnroll: { abbreviation: string; school_partner_id: number }) => ({
            label: schoolOfEnroll?.abbreviation,
            value: `${schoolOfEnroll?.school_partner_id}`,
          })),
      )
      setSchoolofEnrollments(
        schoolOfEnrollments?.getSchoolsOfEnrollmentByRegion
          ?.filter((item: { active: boolean }) => !!item.active)
          .map(
            (schoolOfEnroll: { abbreviation: string; school_partner_id: number }) =>
              `${schoolOfEnroll?.school_partner_id}`,
          ),
      )
    }
  }, [schoolOfEnrollments])

  return {
    loading: loading,
    selectedSchoolofEnrollments: schoolofEnrollments,
    setSelectedSchoolofEnrollments: setSchoolofEnrollments,
    schoolOfEnrollmentList: schoolOfEnrollmentList,
    error: error,
  }
}
