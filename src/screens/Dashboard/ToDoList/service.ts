import { gql } from '@apollo/client'

export const getTodoList = gql`
  query Parent_todos {
    parent_todos {
      submit_enrollment_packet {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      resubmit_enrollment_packet {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      submit_schedule {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
            midyear_application
            schedule_builder_close
            schedule_builder_open
            midyear_schedule_close
            midyear_schedule_open
            second_semester_open
            second_semester_close
          }
        }
      }
      submit_second_semester_schedule {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
            midyear_application
            schedule_builder_close
            schedule_builder_open
            midyear_schedule_close
            midyear_schedule_open
            second_semester_open
            second_semester_close
          }
        }
      }
      resubmit_schedule {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      resubmit_second_semester_schedule {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
            midyear_application
            schedule_builder_close
            schedule_builder_open
            midyear_schedule_close
            midyear_schedule_open
            second_semester_open
            second_semester_close
          }
        }
      }
      resubmit_direct_order {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      resubmit_reimbersement {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      missing_learning_log {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      resubmit_learning_log {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      submit_testing_preference {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      submit_intent_to_reenroll {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      request_homeroom_resources {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
          }
        }
      }
      submit_withdraws {
        category
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
            application_deadline_num_days
            enrollment_packet_deadline_num_days
            enrollment_packet_date_deadline
            withdraw_deadline_num_days
          }
          StudentWithdrawals {
            date
            date_emailed
          }
        }
      }
    }
  }
`
