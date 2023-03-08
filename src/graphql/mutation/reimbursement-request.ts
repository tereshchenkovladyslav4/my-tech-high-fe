import { gql } from '@apollo/client'

export const saveReimbursementRequestMutation = gql`
  mutation CreateOrUpdateReimbursementRequest($requestInput: CreateOrUpdateReimbursementRequestInputs!) {
    createOrUpdateReimbursementRequest(requestInput: $requestInput) {
      reimbursement_request_id
    }
  }
`

/*
CreateOrUpdateReimbursementRequest Variables Structure
{
  "requestInput": {
    "reimbursement_request_id": number | null,
    "SchoolYearId": number,
    "StudentId": number,
    "ParentId": number,
    "form_type": ReimbursementFormType,
    "is_direct_order": boolean,
    "meta": string(JSON),
    "periods": string,
    "signature_file_id": number,
    "signature_name": string,
    "status": ReimbursementRequestStatus,
    "total_amount": number
  }
}
*/

export const deleteReimbursementQuestionMutation = gql`
  mutation DeleteReimbursementRequest($remimbursementRequestId: Float!) {
    deleteReimbursementRequest(remimbursement_request_id: $remimbursementRequestId)
  }
`
/*
DeleteReimbursementRequest Variables Structure
{
  "remimbursementRequestId": number
}
*/

export const deleteReimbursementRequestsMutation = gql`
  mutation DeleteReimbursementRequests($reimbursementRequestsActionInput: ReimbursementRequestsActionInput!) {
    deleteReimbursementRequests(reimbursementRequestsActionInput: $reimbursementRequestsActionInput)
  }
`
