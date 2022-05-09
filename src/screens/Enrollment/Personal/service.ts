import { gql } from '@apollo/client'

export const enrollmentPersonalMutation = gql`
  mutation SaveEnrollmentPacketPersonal($enrollmentPacketPersonalInput: EnrollmentPacketPersonalInput!) {
    saveEnrollmentPacketPersonal(enrollmentPacketPersonalInput: $enrollmentPacketPersonalInput) {
      packet {
        packet_id
      }
      student{
        student_id
        hidden
        status{
          status
        }
        packets{
          files{
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
        }
        applications{
          status
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
          phone {
            phone_id
            person_id
            number
            name
            ext
          }
          address{
            city
            street
            street2
            zip
            state
          }
        }
        grade_levels {
          grade_level
        }
        current_school_year_status {
          school_year_id
          grade_level
        }
      }
    }
  }
`


export const enrollmentContactMutation = gql`
  mutation SaveEnrollmentPacketContact($enrollmentPacketContactInput: EnrollmentPacketContactInput!) {
    saveEnrollmentPacketContact(enrollmentPacketContactInput: $enrollmentPacketContactInput) {
      packet {
        packet_id
      }
      student{
        student_id
        hidden
        status{
          status
        }
        packets{
          files{
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
        }
        applications{
          status
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
          phone {
            phone_id
            person_id
            number
            name
            ext
          }
          address{
            city
            street
            street2
            zip
            state
          }
        }
        grade_levels {
          grade_level
        }
        current_school_year_status {
          school_year_id
          grade_level
        }
      }
    }
  }
`