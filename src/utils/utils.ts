import { SchoolYearType } from './utils.types'
import moment from 'moment'

export const checkEnrollPacketStatus = (schoolYears: SchoolYearType[], student: any): boolean => {
  if (student?.status && student?.status?.at(-1)?.status != 0) return true
  if (schoolYears.length > 0) {
    const studentSchoolYear: SchoolYearType[] = schoolYears?.filter(
      (item) => item.school_year_id == student?.current_school_year_status?.school_year_id,
    )

    return (studentSchoolYear?.length > 0 && studentSchoolYear?.at(-1)?.enrollment_packet) || false
  } else {
    return false
  }
}

export const convertDateToUTCDate = (date: Date | string | undefined, time: string = '00:00') => {
  return new Date(`${moment(new Date(date || '')).format('yyyy-MM-DD')} ${time}`).toISOString()
}
