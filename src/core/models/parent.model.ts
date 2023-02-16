import { Person } from './person.model'
import { Student } from './student.model'

export type Parent = {
  notes?: string
  person: Person
  students?: Student[]
}
