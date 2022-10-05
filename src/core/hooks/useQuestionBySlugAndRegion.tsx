import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { getEnrollmentQuestionsBySlugAndRegionGql } from '@mth/graphql/queries/enrollment-question'
import { getStudentDetail } from '@mth/screens/Admin/UserProfile/services'
import { getQuestionsGql } from '@mth/screens/Applications/NewParent/service'

interface SpecialEduType {
  label: string
  value: number
}
interface SpecialEduReturnType {
  options: Array<SpecialEduType>
  value: number
  label: string
}

interface QuestionType {
  id: number
  type: number
  order: number
  question: string
  options: string
  required: boolean
  default_question: boolean
  student_question?: boolean
  validation: number
  region_id?: number
  slug: string
  additional_question?: string
}

const extractSpecialEduFromQues = (arr: Array<QuestionType>, slug: string) => {
  let returnVal: Array<SpecialEduType> = []
  const specialEduQues = arr.filter((item) => item.slug === slug)
  if (specialEduQues.length && slug === 'meta_special_education') {
    returnVal = JSON.parse(specialEduQues[0].options)
  }
  return returnVal
}

export const useQuestionBySlugAndRegion = (
  studentId: number,
  slug: string,
): {
  loadedDecideSpecialEdu: boolean
  decideSpecialEduData: SpecialEduReturnType
  decideSpecialEduError: ApolloError | undefined
} => {
  const [specEdu, setSpecEdu] = useState<SpecialEduReturnType>({ options: [], value: 0, label: '' })
  const { loading: loadingStudentDetail, data: studentDetailData } = useQuery(getStudentDetail, {
    variables: { student_id: studentId },
    fetchPolicy: 'network-only',
  })
  const {
    loading: loadingApplicationQues,
    data: applicationQuesData,
    error: applicationQuesDataErr,
    refetch: refetchApplicationQues,
  } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: 1 } },
    fetchPolicy: 'network-only',
  })
  const {
    loading: loadingEnrollmentQues,
    data: enrollmentQuesData,
    error: enrollmentQuesDataErr,
    refetch: refetchEnrollmentQues,
  } = useQuery(getEnrollmentQuestionsBySlugAndRegionGql, {
    variables: { regionId: 1, slug: slug },
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!loadingStudentDetail) {
      const stuRegionId = studentDetailData.student.applications.at(-1).school_year.RegionId
      refetchEnrollmentQues({ regionId: stuRegionId, slug: slug })
      refetchApplicationQues({ input: { region_id: stuRegionId } })
      let quesList
      if (!studentDetailData.student?.packets?.at(-1)?.special_ed) {
        quesList = extractSpecialEduFromQues(applicationQuesData.getApplicationQuestions, slug)
      } else {
        quesList = extractSpecialEduFromQues(enrollmentQuesData.getEnrollmentQuestionsBySlugAndRegion, slug)
      }
      const filtered = quesList.filter((item) => item.value === studentDetailData.student.special_ed)
      if (filtered.length) {
        setSpecEdu({
          ...specEdu,
          options: quesList,
          value: studentDetailData.student.special_ed,
          label: filtered[0].label,
        })
      } else {
        setSpecEdu({ ...specEdu, options: quesList })
      }
    }
  }, [loadingStudentDetail])

  return {
    loadedDecideSpecialEdu: !loadingApplicationQues && !loadingEnrollmentQues,
    decideSpecialEduData: specEdu,
    decideSpecialEduError: applicationQuesDataErr || enrollmentQuesDataErr,
  }
}
