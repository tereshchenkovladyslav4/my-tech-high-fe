import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const confirmAccount = gql`
  mutation Verify($verifyInput: VerifyInput!) {
    verify(verifyInput: $verifyInput) {
      email
      status
      token
    }
  }
`;
export const forgotPasswordMutation = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
export const resetPasswordMutation = gql`
  mutation ResetPassword($verifyInput: VerifyInput!) {
    resetPassword(verifyInput: $verifyInput) {
      email
      status
      token 
    }
  }
`;
