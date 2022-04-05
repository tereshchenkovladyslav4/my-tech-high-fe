import { createContext } from "react"
import { StudentType } from '../../../HomeroomStudentProfile/Student/types'

export const studentContext = createContext<StudentType | null>(null)

