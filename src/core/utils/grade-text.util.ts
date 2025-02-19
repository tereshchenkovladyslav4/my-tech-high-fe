import { SchoolYear, Student } from '@mth/models'
import { toOrdinalSuffix } from './string.util'

export const gradeText = (student: Student): string => {
  if (!student.grade_levels?.length) {
    return ''
  }
  const gradeLevel: string | number | undefined = student.grade_levels[student.grade_levels.length - 1]?.grade_level

  if (!gradeLevel) return ''

  return (gradeLevel + '').toLowerCase().startsWith('k') ? 'Kindergarten' : `${toOrdinalSuffix(+gradeLevel)} Grade`
}

export const calculateGrade = (
  student: Student,
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

export const currentGradeText = (student: Student): string => {
  if (student) {
    if (!student.grade_levels?.length) {
      return ''
    }
    let gradeLevel = student.grade_levels?.find(
      (item) => item.school_year_id == student.current_school_year_status?.school_year_id,
    )?.grade_level
    if (!gradeLevel && student.grade_levels.length) {
      gradeLevel = student.grade_levels[0].grade_level
    }
    if (gradeLevel)
      return (gradeLevel + '').toLowerCase().startsWith('k') ? 'Kindergarten' : `${toOrdinalSuffix(+gradeLevel)} Grade`
  }
  return ''
}

export const gradeNum = (student: Student | undefined): string => {
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

export const gradeShortText = (gradeLevel?: number | string | null | undefined): string => {
  return gradeLevel === -1 || (gradeLevel + '').toLowerCase().startsWith('k') ? 'K' : (gradeLevel || '').toString()
}

export const parseGradeLevel = (value?: string | number): string => {
  if (!value) return ''
  if (value === 'OR-K') return 'OR - Kindergarten (5)'
  if (['K', 'Kindergarten', 'Kin'].indexOf(value + '') !== -1) return 'Kindergarten (5)'
  const numberValue = parseInt(value + '')

  if (numberValue === 1) return '1st Grade (6)'
  if (numberValue === 2) return '2nd Grade (7)'
  if (numberValue === 3) return '3rd Grade (8)'
  return `${value}th Grade (${value !== '12' ? numberValue + 5 : `${numberValue + 5}/${numberValue + 6}`})`
}
