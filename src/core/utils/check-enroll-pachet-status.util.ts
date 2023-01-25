import { SchoolYear, Student } from '@mth/models'

/**
 * @param {SchoolYear} schoolYears
 * @param {Student} student
 * @description check enrollment packet is submitted or not
 * @logic if enrollment packet is submitted, return true else return false
 * @return boolean
 */
export const checkEnrollPacketStatus = (schoolYears: SchoolYear[], student: Student): boolean => {
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
