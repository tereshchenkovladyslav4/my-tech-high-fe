import { gql } from '@apollo/client'

export const getTodoList = gql`
query Parent_todos {
  parent_todos {
    submit_enrollment_packet {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
        current_school_year_status {
          student_id
          school_year_id
          application_id
          application_status
          packet_status
          packet_id
          application_school_year_id
          grade_level
          application_date_submitted
          application_date_started
          application_date_accepted
        }
      }
    }
    resubmit_enrollment_packet {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    submit_schedule {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    resubmit_schedule {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    resubmit_direct_order {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    resubmit_reimbersement {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    missing_learning_log {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    resubmit_learning_log {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    submit_testing_preference {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    submit_intent_to_reenroll {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
    request_homeroom_resources {
      button
      dashboard
      homeroom
      icon
      phrase
      students {
        student_id
        person {
          first_name
          last_name
          person_id
          photo
          preferred_first_name
          preferred_last_name
        }
      }
    }
  }
}
`
