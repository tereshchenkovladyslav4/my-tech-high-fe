import { ReimbursementRequestStatus } from '@mth/enums'
import { ReimbursementRequest } from '@mth/models'

export type StudentInfoProps = {
  request: ReimbursementRequest
  requestStatus: ReimbursementRequestStatus | undefined
  handleChangeRequestStatus: (value: ReimbursementRequestStatus) => void
  setIsChanged: (value: boolean) => void
}
