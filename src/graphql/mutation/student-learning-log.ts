import { gql } from '@apollo/client'

export const saveStudentLearningLogMutation = gql`
  mutation CreateOrUpdateStudentLearningLog($createStudentLearningLogInput: CreateOrUpdateStudentLearningLogInput!) {
    createOrUpdateStudentLearningLog(createStudentLearningLogInput: $createStudentLearningLogInput) {
      id
    }
  }
`

/*
saveStudentLearningLogMutation Variables Structure
{
  "createStudentLearningLogInput": {
    "id": number,
    "StudentId": number,
    "SchoolYearId": number,
    "AssignmentId": number,
    "grade": number,
    "meta": string,
    "status": string
  }
}
*/
