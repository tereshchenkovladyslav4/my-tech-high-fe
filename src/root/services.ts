import { gql } from '@apollo/client'

export const getMeQuery = gql`
  query Me {
    me {
      masquerade
      profile {
        first_name
        last_name
        middle_name
        email
        person_id
        preferred_last_name
        preferred_first_name
        date_of_birth
        gender
        address {
          address_id
          city
          name
          state
          street
          street2
          zip
          county_id
          country_id
        }
        phone {
          phone_id
          person_id
          number
          name
          ext
          recieve_text
        }
      }
      email
      user_id
      first_name
      last_name
      last_login
      cookie
      avatar_url
      level
      role {
        id
        name
        level
      }
      userRegion {
        region_id
        regionDetail {
          id
          name
          program
          state_logo
        }
      }
      userAccess {
        access_id
        accessDetail {
          id
          name
        }
      }
      students {
        testing_preference
        student_id
        special_ed
        diploma_seeking
        hidden
        status {
          status
        }
        packets {
          files {
            file_id
            kind
            mth_file_id
            packet_id
          }
          missing_files
          packet_id
          birth_place
          birth_country
          hispanic
          language
          language_home
          language_home_child
          language_friends
          language_home_preferred
          household_size
          household_income
          worked_in_agriculture
          military
          race
          living_location
          lives_with
          work_move
          last_school
          last_school_address
          last_school_type
          school_district
          agrees_to_policy
          ferpa_agreement
          permission_to_request_records
          photo_permission
          secondary_contact_first
          secondary_contact_last
          secondary_email
          secondary_phone
          status
          meta
          special_ed
        }
        applications {
          status
          application_id
        }
        person {
          email
          first_name
          gender
          last_name
          middle_name
          person_id
          preferred_first_name
          preferred_last_name
          date_of_birth
          photo
          phone {
            phone_id
            person_id
            number
            name
            ext
          }
          address {
            city
            street
            street2
            zip
            state
            county_id
            country_id
          }
        }
        grade_levels {
          grade_level
        }
        grade_level
        current_school_year_status {
          application_id
          application_school_year_id
          application_status
          packet_id
          packet_status
          school_year_id
          student_id
          grade_level
          special_ed_options
        }
      }
    }
  }
`
