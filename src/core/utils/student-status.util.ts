import moment from 'moment/moment'
import { StudentStatus } from '@mth/enums'
import { StudentStatusModel } from '@mth/models'

export const studentStatusText = (studentStatusData: StudentStatusModel | undefined, showDate = false): string => {
  const dateStr = showDate ? ` ${moment(studentStatusData?.date_updated).format('MM/DD/YYYY')}` : ''
  switch (studentStatusData?.status) {
    case StudentStatus.APPLIED: {
      return `Applied${dateStr}`
    }
    case StudentStatus.REAPPLIED: {
      return `Applied (re-apply)${dateStr}`
    }
    case StudentStatus.ACCEPTED: {
      return `Accepted${dateStr}`
    }
    case StudentStatus.PENDING: {
      return `Pending${dateStr}`
    }
    case StudentStatus.ACTIVE: {
      return `Active${dateStr}`
    }
    case StudentStatus.WITHDRAWN: {
      return `Withdrawn${dateStr}`
    }
  }

  return ''
}
