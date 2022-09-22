import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { getAssessmentsBySchoolYearId } from '@mth/graphql/queries/assessment'
import { AssessmentType } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/types'

export const useAssessmentsBySchoolYearId = (
  school_year_id: number,
): {
  loading: boolean
  assessments: AssessmentType[]
  schoolYear: {
    school_year_id: number
    testing_preference_title: string
    testing_preference_description: string
    opt_out_form_title: string
    opt_out_form_description: string
    diploma_seeking: boolean
    testing_preference: boolean
  }
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [assessmentItems, setAssessmentItems] = useState<AssessmentType[]>([])

  const { data, loading, refetch, error } = useQuery(getAssessmentsBySchoolYearId, {
    variables: {
      schoolYearId: school_year_id,
    },
    skip: school_year_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getAssessmentsBySchoolYearId) {
      const items = data?.getAssessmentsBySchoolYearId
      setAssessmentItems(items.map((item: AssessmentType) => ({ ...item, assessment_id: Number(item.assessment_id) })))
    } else {
      setAssessmentItems([])
    }
  }, [data, loading])

  return {
    loading: loading,
    assessments: assessmentItems,
    schoolYear: data?.getAssessmentsBySchoolYearId?.at(-1)?.SchoolYear,
    error: error,
    refetch: refetch,
  }
}
