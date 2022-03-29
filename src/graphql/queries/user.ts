import { gql } from '@apollo/client';

export const getAllUsers = gql`
  query Users {
    users {
        email
        user_id
        first_name
        last_name
        last_login
        can_emulate
        status
        level
        student {
          parent_email
        }
        role {
          id
          name
          level
        }
      }
  }
`

export const getUsersByRegions = gql`
  query UsersByRegions($regions:[Int!]!) {
    usersByRegions(regions:$regions) {
        email
        user_id
        first_name
        last_name
        last_login
        can_emulate
        status
        level
        student {
          parent_email
        }
        role {
          id
          name
          level
        }
      }
  }
`


export const getUser = gql`
  query User($user_id:ID!) {
    user(user_id:$user_id) {
        email
        user_id
        first_name
        last_name
        last_login
        cookie
        avatar_url
        can_emulate
        level
        status
        student {
          parent_email
        }
         role {
          id
          name
          level
        }
        userRegion {
          region_id
        }
        userAccess{
          access_id
        }
    }
  }
`
