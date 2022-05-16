import { createContext } from "react"
import { StudentType } from '../../../HomeroomStudentProfile/Student/types'
import { EnrollmentQuestionTab } from "../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types"

export const studentContext = createContext<StudentType | null>(null)
  
  export const PacketModalQuestionsContext = createContext<Array<EnrollmentQuestionTab>>([])