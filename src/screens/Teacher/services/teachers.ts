import { gql } from '@apollo/client'

export const GetTeachersByUserIdQuery = gql`
  query GetTeachersByUserId($userId: Int!) {
    getTeachersByUserId(userId: $userId) {
      results
    }
  }
`
