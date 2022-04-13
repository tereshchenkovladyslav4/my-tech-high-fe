import {gql} from "../../../../../../_snowpack/pkg/@apollo/client.js";
export const getQuestionsGql = gql`
  query getApplicationQuestions($input: ApplicatinQuestionsInput) {
    getApplicationQuestions(input: $input) {
      id
      type
      order
      question
      options
      required
      region_id
    }
  }
`;
export const saveQuestionsGql = gql`
  mutation saveApplicationQuestions($input: [NewApplicationQuestionsInput!]!) {
    saveApplicationQuestions(data: $input)
  }
`;
export const deleteQuestionGql = gql`
  mutation deleteApplicationQuestion($id: Int!) {
    deleteApplicationQuestion(id: $id)
  }
`;
