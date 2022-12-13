import { SchoolYear } from '@mth/models'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'

/**
 * @param {schoolYears} SchoolYear
 * @param {student} StudentType
 * @description check enrollment packet is submitted or not
 * @logic if enrollment packet is submitted, return true else return false
 * @return boolean
 */
export const checkEnrollPacketStatus = (schoolYears: SchoolYear[], student: StudentType): boolean => {
  if (student?.status && student?.status?.at(-1)?.status != 0) return true
  if (schoolYears.length > 0) {
    const studentSchoolYear = schoolYears?.filter(
      (item) => item.school_year_id == student?.current_school_year_status?.school_year_id,
    )
    return (studentSchoolYear?.length > 0 && studentSchoolYear?.at(-1)?.enrollment_packet) || false
  } else {
    return false
  }
}
