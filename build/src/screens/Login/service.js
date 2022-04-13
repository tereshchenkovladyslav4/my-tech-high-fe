import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const loginMutation = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      jwt
    }
  }
`;
