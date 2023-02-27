import { gql } from '@apollo/client'

export const getStudentLearningLogsQuery = gql`
  query LearningLogsForStudent(
    $filter: StudentLearningLogFilter
    $sort: String
    $skip: Int
    $search: String
    $take: Int
  ) {
    learningLogsForStudent(filter: $filter, sort: $sort, skip: $skip, search: $search, take: $take) {
      total
      results {
        id
        master_id
        title
        due_date
        auto_grade_email
        auto_grade
        teacher_deadline
        reminder_date
        page_count
        StudentLearningLogs {
          status
          meta
          grade
          AssignmentId
          SchoolYearId
          StudentId
          created_at
          updated_at
          id
        }
        Master {
          master_id
          instructions
        }
      }
    }
  }
`
/*
// Variable Structure //
{
  "filter": {
    "showAll": true,
    "student_id": 3341,
    "school_year_id": 19
  },
  "search": "",
  "skip": 0,
  "sort": "dueDate|asc",
  "take": 25
}
*/
