import { gql } from '@apollo/client'

export const saveReimbursementReceiptMutation = gql`
  mutation CreateOrUpdateReimbursementReceipts($requestInput: CreateOrUpdateReimbursementReceiptInput!) {
    createOrUpdateReimbursementReceipts(requestInput: $requestInput) {
      reimbursement_receipt_id
    }
  }
`

export const deleteReimbursementReceiptsMutation = gql`
  mutation DeleteReimbursementReceipts($reimbursementReceiptsActionInput: ReimbursementReceiptsActionInput!) {
    deleteReimbursementReceipts(reimbursementReceiptsActionInput: $reimbursementReceiptsActionInput)
  }
`

/*
CreateOrUpdateReimbursementReceipts Variables Structure
{
  "requestInput": {
    "receipts": [
      {
        "reimbursement_receipt_id": number,
        "file_name": string,
        "file_id": number,
        "amount": number,
        "ReimbursementRequestId": number
      }
    ]
  }
}
*/
