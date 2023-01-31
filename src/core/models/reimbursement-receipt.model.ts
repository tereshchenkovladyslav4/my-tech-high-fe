export type ReimbursementReceipt = {
  reimbursement_receipt_id: number
  ReimbursementRequestId: number
  file_id: number
  file_name: string
  amount: number | null
  created_at?: Date

  // Temp variable
  file?: File
}
