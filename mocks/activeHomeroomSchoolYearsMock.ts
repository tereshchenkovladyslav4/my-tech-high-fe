import { getActiveStudentHomeroomSchoolYearsQuery } from '@mth/graphql/queries/school-year'

export const ActiveStudentHomeroomSchoolYearsQueryMock = [
  {
    request: {
      query: getActiveStudentHomeroomSchoolYearsQuery,
      variables: { studentId: 3341 },
    },
    result: {
      data: {
        activeHomeroomSchoolYears: [
          {
            HomeroomSettings: [],
            IsCurrentYear: true,
            date_begin: '2022-06-02',
            date_end: '2023-09-06',
            school_year_id: 19,
          },
        ],
      },
    },
  },
]
export const ActiveStudentHomeroomSchoolYearsQueryWrongMock = [
  {
    request: {
      query: getActiveStudentHomeroomSchoolYearsQuery,
      variables: { studentId: 3341 },
    },
    result: {
      data: {
        activeHomeroomSchoolYears: [],
      },
    },
  },
]
