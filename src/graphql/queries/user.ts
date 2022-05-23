import { gql } from '@apollo/client'

export const getAllUsers = gql`
  query Users {
    users {
      email
      user_id
      first_name
      last_name
      last_login
      can_emulate
      masquerade
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
  query UsersByRegions($filters: [String!], $regionId: Int, $search: String, $skip: Int, $sort: String, $take: Int) {
    usersByRegions(filters: $filters, region_id: $regionId, search: $search, skip: $skip, sort: $sort, take: $take) {
      results {
        email
        user_id
        first_name
        masquerade
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
      total
    }
  }
`

export const getParentDetailByEmail = gql`
  query ParentDetailByEmail($email: String!) {
    parentDetailByEmail(email: $email) {
      parent_id
      notes
      observers {
        observer_id
        parent_id
        student_id
        notes
        person {
          person_id
          email
          first_name
          last_name
          middle_name
          preferred_first_name
          preferred_last_name
          gender
          date_of_birth
          phone {
            person_id
            phone_id
            name
            ext
            number
          }
          address {
            address_id
            street
            street2
            state
            zip
            city
            county_id
          }
        }
      }
      students {
        student_id
        parent_id
        grade_level
        special_ed
        teacher_notes
        diploma_seeking
        school_of_enrollment
        testing_preference
        status {
          student_id
          school_year_id
          status
          date_updated
        }
        grade_levels {
          grade_level
        }
        person {
          person_id
          email
          first_name
          last_name
          middle_name
          preferred_first_name
          preferred_last_name
          gender
          date_of_birth
          address {
            address_id
            street
            street2
            state
            zip
            city
            county_id
          }
        }
      }
      phone {
        person_id
        phone_id
        name
        ext
        number
      }
      person {
        person_id
        email
        first_name
        last_name
        middle_name
        preferred_first_name
        preferred_last_name
        gender
        date_of_birth
        user {
          userRegions {
            regionDetail {
              name
            }
          }
        }
        address {
          address_id
          street
          street2
          state
          zip
          city
          county_id
        }
      }
    }
  }
`

export const getUser = gql`
  query User($user_id: ID!) {
    user(user_id: $user_id) {
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
      userAccess {
        access_id
      }
    }
  }
`
