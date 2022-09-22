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
