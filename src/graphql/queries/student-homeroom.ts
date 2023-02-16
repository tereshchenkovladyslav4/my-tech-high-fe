import { gql } from '@apollo/client'

export const getStudentHomeroomInfoQuery = gql`
  query StudentHomeroomInfo($schoolYearId: Int!, $studentId: Int!) {
    studentHomeroomInfo(school_year_id: $schoolYearId, student_id: $studentId) {
      Class {
        class_id
        class_name
        PrimaryTeacher {
          first_name
          last_name
          firstName
          lastName
          user_id
        }
      }
    }
  }
`
/*
// Variable Structure //
{  
  "schoolYearId": null,
  "studentId": nulll
}
*/
