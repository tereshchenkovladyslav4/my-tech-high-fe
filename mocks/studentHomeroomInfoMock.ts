import { getStudentHomeroomInfoQuery } from '@mth/graphql/queries/student-homeroom'

export const StudentHomeroomInfoQueryMock = [
  {
    request: {
      query: getStudentHomeroomInfoQuery,
      variables: { schoolYearId: 19, studentId: 3341 },
    },
    result: {
      data: {
        studentHomeroomInfo: {
          Class: {
            class_id: '21',
            class_name: 'Makerspace',
            PrimaryTeacher: {
              first_name: 'Primary',
              last_name: 'Teacher',
              user_id: 0,
            },
          },
        },
      },
    },
  },
]

export const StudentHomeroomInfoQueryWarningMock = [
  {
    request: {
      query: getStudentHomeroomInfoQuery,
      variables: { schoolYearId: 19, studentId: 3341 },
    },
    result: {
      data: {
        studentHomeroomInfo: null,
      },
    },
  },
]
