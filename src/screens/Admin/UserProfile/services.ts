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
        address {
          address_id
          street
          street2
          state
          zip
          city
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
      school_of_enrollment
      diploma_seeking
      reenrolled
      teacher_notes
      grade_levels {
        grade_level
      }
      packets {
        student_id
      }
      status {
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
        school_year {
          date_begin
          date_end
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
