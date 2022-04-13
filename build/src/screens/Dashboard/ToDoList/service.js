import {gql} from "../../../../_snowpack/pkg/@apollo/client.js";
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
        }
      }
    }
  }
}
`;
