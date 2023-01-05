import { Parent } from './parent.model'
import { Person } from './person.model'
import { StudentGradeLevel } from './student-grade-level.model'
import { StudentStatusModel } from './student-status.model'

export type Student = {
  student_id: number
  person: Person
  parent: Parent
  status: StudentStatusModel[]
  grade_levels: StudentGradeLevel[]
}
