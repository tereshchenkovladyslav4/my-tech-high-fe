import {gql} from "../../../../_snowpack/pkg/@apollo/client.js";
export const newParentApplicationMutation = gql`
  mutation NewParentApplication($createApplicationInput: CreateApplicationInput!) {
    createNewApplication(createApplicationInput: $createApplicationInput) {
      parent {
        parent_id
      }
    }
  }
`;
export const checkEmailQuery = gql`
  query CheckEmail($email: String!) {
    emailTaken(email: $email)
  }
`;
export const getSchoolYearQuery = gql`
  query SchoolYears {
    schoolYears {
      school_year_id
      date_begin
      date_end
    }
  }
`;
