import { GetLearingLogQuestionByAssignmentIdQuery } from '@mth/graphql/queries/learning-log-question'

export const learningLogQuestionsQueryMock = [
  {
    request: {
      query: GetLearingLogQuestionByAssignmentIdQuery,
      variables: { assignmentId: 1 },
    },
    result: {
      data: {
        getLearningLogQuestionByAssignmentId: [
          {
            id: 1,
            assignment_id: 1,
            type: 'string',
            slug: 'meta_1231',
            parent_slug: '',
            question: 'Question1',
            options: '',
            default_question: false,
            validations: '["required"]',
            grades: '',
            page: 1,
            order: 1,
            can_upload: false,
            grade_specific: false,
          },
          {
            id: 2,
            assignment_id: 1,
            type: 'string2',
            slug: 'meta_12312',
            parent_slug: '',
            question: 'Question2',
            options: '',
            default_question: false,
            validations: '["required"]',
            grades: '',
            page: 1,
            order: 2,
            can_upload: false,
            grade_specific: false,
          },
        ],
      },
    },
  },
]
export const learningLogQuestionsQueryWrongMock = [
  {
    request: {
      query: GetLearingLogQuestionByAssignmentIdQuery,
      variables: { assignmentId: 1 },
    },
    result: {
      data: {
        getLearningLogQuestionByAssignmentId: [],
      },
    },
  },
]
