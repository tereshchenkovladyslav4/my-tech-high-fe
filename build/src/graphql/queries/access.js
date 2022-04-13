import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const getAllAccess = gql`
  query getAllAccesses {
    getAllAccesses  {
        id
        name
    }
  }
`;
