import { gql } from '@apollo/client'
export const getParentDetail = gql`
  query ParentDetail($id: ID!) {
    parentDetail(id: $id) {
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
            school_district
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
          user {
            user_id
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
          user_id
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
          school_district
        }
      }
    }
  }
`

export const updatePersonAddressMutation = gql`
  mutation UpdatePersonAddress($updatePersonAddressInput: UpdatePersonAddressInput!) {
    updatePersonAddress(updatePersonAddressInput: $updatePersonAddressInput) {
      person_id
    }
  }
`

export const getStudentDetail = gql`
  query student($student_id: ID!) {
    student(student_id: $student_id) {
      student_id
      special_ed
      diploma_seeking
      reenrolled
      teacher_notes
      testing_preference
      grade_levels {
        grade_level
      }
      currentSoe {
        school_partner_id
        school_year_id
        partner {
          name
          abbreviation
        }
      }
      packets {
        student_id
        packet_id
        status
        deadline
        date_submitted
        date_accepted
        date_last_submitted
        special_ed
        school_district
      }
      status {
        student_id
        school_year_id
        status
        date_updated
      }
      status_history {
        student_id
        school_year_id
        status
        date_updated
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
          school_district
        }
        phone {
          person_id
          phone_id
          name
          ext
          number
        }
      }
      applications {
        application_id
        date_submitted
        date_accepted
        status
        school_year_id
        midyear_application
        school_year {
          date_begin
          date_end
          midyear_application_open
          midyear_application_close
          RegionId
        }
      }
      current_school_year_status {
        application_id
        school_year_id
        special_ed_options
      }
      parent {
        person {
          first_name
          last_name
        }
      }
    }
  }
`

export const CreateObserMutation = gql`
  mutation CreateObserver($observerInput: ObserverInput!) {
    createObserver(observerInput: $observerInput) {
      observer_id
    }
  }
`
export const UpdateStudentMutation = gql`
  mutation UpdateStudent($updateStudentInput: UpdateStudentInput!) {
    updateStudent(updateStudentInput: $updateStudentInput)
  }
`

export const DeleteWithdrawal = gql`
  mutation DeleteWithdrawal($activeOption: Int!, $studentId: Int!) {
    deleteWithdrawal(active_option: $activeOption, student_id: $studentId)
  }
`
export const getSchoolYearsByRegionId = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      SchoolYears {
        school_year_id
        date_begin
        date_end
        grades
        birth_date_cut
        special_ed
        special_ed_options
        enrollment_packet
        date_reg_close
        date_reg_open
        midyear_application
        midyear_application_close
        midyear_application_open
      }
    }
  }
`

export const getCountiesByRegionId = gql`
  query getCounties($regionId: ID!) {
    getCounties(id: $regionId) {
      id
      county_name
    }
  }
`

export const getSchoolDistrictsByRegionId = gql`
  query SchoolDistrict($regionId: ID!) {
    schoolDistrict(id: $regionId) {
      id
      school_district_name
      Region_id
    }
  }
`
