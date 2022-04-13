import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const getAllRegion = gql`
  query Regions {
    regions {
        id
        name
    }
  }
`;
