import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { SchoolYearType } from './utils.types'

export const checkEnrollPacketStatus = (schoolYears: SchoolYearType[], student: StudentType): boolean => {
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

export const extractContent = (s: string): string | null => {
  const span = document.createElement('span')
  span.innerHTML = s
  return span.textContent || span.innerText
}

export const getPreviousSchoolYearId = (
  currentYearId: string | number,
  schoolYears: SchoolYearType[],
): string | number | undefined => {
  const currentSchoolYear = schoolYears.find((year: SchoolYearType) => year.school_year_id == currentYearId)
  let previousYearId
  if (currentSchoolYear) {
    const year = currentSchoolYear.date_begin?.split('-')?.[0]
    if (year) {
      const previousYear = parseInt(year) - 1
      previousYearId = schoolYears.find((year: SchoolYearType) =>
        year.date_begin?.includes(`${previousYear}-`),
      )?.school_year_id
    }
  }
  return previousYearId
}

export const extractAllNumFromStr = (str: string): Array<number> => {
  const nums = str.match(/\d+/g)
  if (nums) return nums.map(Number)
  else return []
}

export const phoneFormat = (phone: string): string => {
  if (!phone) {
    return ''
  }
  phone = phone.replaceAll('-', '')
  return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
}
