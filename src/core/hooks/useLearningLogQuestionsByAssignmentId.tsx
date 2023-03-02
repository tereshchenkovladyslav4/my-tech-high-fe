import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GetLearingLogQuestionByAssignmentIdQuery } from '@mth/graphql/queries/learning-log-question'
import { LearningLogQuestion } from '@mth/models'

export const useLearningLogQuestionsByAssignmentId = (
  assignment_id: number | undefined,
): {
  learningLogQuestions: LearningLogQuestion[]
  setLearingLogQuestions: (value: LearningLogQuestion[]) => void
  refetch: () => void
  loading: boolean
} => {
  const [questions, setQuestions] = useState<LearningLogQuestion[]>([])

  const [getLearningLogQuestion, { loading: learningLogQuestionLoading, data: learningLogQuestionData, refetch }] =
    useLazyQuery(GetLearingLogQuestionByAssignmentIdQuery, {
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    if (assignment_id) {
      getLearningLogQuestion({
        variables: {
          assignmentId: +assignment_id,
        },
      })
    }
  }, [assignment_id])

  useEffect(() => {
    if (!learningLogQuestionLoading && learningLogQuestionData?.getLearningLogQuestionByAssignmentId) {
      setQuestions(
        learningLogQuestionData?.getLearningLogQuestionByAssignmentId?.map((question: LearningLogQuestion) => ({
          ...question,
          required: (JSON.parse(question.validations || '[]') as string[])?.includes('required') ? true : false,
          Validations: JSON.parse(question.validations || '[]'),
          Options: JSON.parse(question.options || '[]'),
          Grades: JSON.parse(question.grades || '[]'),
          grades: JSON.parse(question.grades || '[]'),
          active: !question.parent_slug ? true : false,
        })) as LearningLogQuestion[],
      )
    }
  }, [learningLogQuestionLoading, learningLogQuestionData])

  return {
    learningLogQuestions: questions,
    setLearingLogQuestions: setQuestions,
    refetch,
    loading: learningLogQuestionLoading,
  }
}
