import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { getReimbursementQuestionsQuery } from '@mth/graphql/queries/reimbursement-question'
import { ReimbursementQuestion } from '@mth/models'
import { ReimbursementFormType } from '../enums/reimbursement-form-type'

export const useReimbursementQuestions = (
  schoolYearId: number | undefined,
  formType: ReimbursementFormType,
  isDirectOrder: boolean | undefined,
): {
  loading: boolean
  reimbursementQuestions: ReimbursementQuestion[]
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [questions, setQuestions] = useState<ReimbursementQuestion[]>([])

  const { loading, data, error, refetch } = useQuery(getReimbursementQuestionsQuery, {
    variables: {
      schoolYearId: +(schoolYearId || 0),
      reimbursementFormType: formType,
      isDirectOrder: isDirectOrder ? true : false,
    },
    skip: !schoolYearId || !formType,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.reimbursementQuestions) {
      const { reimbursementQuestions } = data
      setQuestions(
        reimbursementQuestions?.map((question: ReimbursementQuestion) => {
          return { ...question, Options: JSON.parse(question?.options) }
        }) || [],
      )
    }
  }, [loading, data])

  return {
    loading,
    reimbursementQuestions: questions,
    error: error,
    refetch,
  }
}
