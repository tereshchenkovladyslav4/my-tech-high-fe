import { SchoolYear } from '@mth/models'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { toOrdinalSuffix } from './string.util'

export const gradeText = (student: StudentType): string => {
  if (!student.grade_levels?.length) {
    return ''
  }
  const gradeLevel = student.grade_levels[student.grade_levels.length - 1]?.grade_level

  if (gradeLevel === undefined) return ''

  return (gradeLevel + '').toLowerCase().startsWith('k') ? 'Kindergarten' : `${toOrdinalSuffix(+gradeLevel)} Grade`
}

export const calculateGrade = (
  student: StudentType,
  schoolYears: SchoolYear[],
  selectedYear: SchoolYear | undefined,
): string => {
  if (student && schoolYears?.length && selectedYear) {
    if (!student.grade_levels?.length) {
      return ''
    }
    const gradeLevel = student.grade_levels[student.grade_levels.length - 1]?.grade_level
    const activeSchoolYear = schoolYears?.find(
      (schoolYear) => schoolYear.school_year_id === student.current_school_year_status?.school_year_id,
    )
    const diffYear =
      Number(selectedYear?.date_begin?.split('-')?.[0]) - Number(activeSchoolYear?.date_end?.split('-')?.[0]) + 1
    if (gradeLevel === undefined) return ''

    return (gradeLevel + '').toLowerCase().startsWith('k')
      ? diffYear == 0
        ? 'Kindergarten'
        : `${toOrdinalSuffix(1)} Grade`
      : `${toOrdinalSuffix(+gradeLevel + diffYear)} Grade`
  } else return ''
}

export const currentGradeText = (student: StudentType): string => {
  if (student) {
    if (!student.grade_levels?.length) {
      return ''
    }
    const gradeLevel = student.grade_levels?.find(
      (item) => item.school_year_id == student.current_school_year_status?.school_year_id,
    )?.grade_level

    if (gradeLevel)
      return (gradeLevel + '').toLowerCase().startsWith('k') ? 'Kindergarten' : `${toOrdinalSuffix(+gradeLevel)} Grade`
  }
  return ''
}

export const gradeNum = (student: StudentType | undefined): string => {
  if (!student || !student.grade_levels?.length) {
    return ''
  }
  const gradeLevel = student.grade_levels[student.grade_levels.length - 1]?.grade_level

  if (gradeLevel === undefined) return ''

  return (gradeLevel + '').toLowerCase().startsWith('k') ? 'Kindergarten' : gradeLevel.toString()
}

export const sortGrades = (grades: string): string => {
  let result = ''
  if (grades) {
    const tempArray = grades.split(',')
    if (tempArray.includes('Kindergarten') || tempArray.includes('Kin')) {
      result = 'K,'
    }
    result += tempArray
      .filter((item) => !item.includes('Kin'))
      .sort((a: string, b: string) => {
        if (Number(a) > Number(b)) {
          return 1
        } else if (Number(a) < Number(b)) {
          return -1
        }
        return 0
      })
      .join(',')
    return result
  } else {
    result = 'Select'
  }
  return result
}

export const gradeShortText = (gradeLevel?: number | null): string => {
  return gradeLevel === -1 ? 'K' : (gradeLevel || '').toString()
}
