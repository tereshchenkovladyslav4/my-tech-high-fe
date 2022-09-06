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
