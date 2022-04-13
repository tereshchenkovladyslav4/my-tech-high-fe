import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const getAllRoles = gql`
  query Roles {
    roles  {
        id
        name
        level
    }
  }
`;
