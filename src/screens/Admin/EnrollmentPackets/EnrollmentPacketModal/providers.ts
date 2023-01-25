import { createContext } from 'react'
import { Student } from '@mth/models'
import { EnrollmentQuestionTab } from '../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

export const studentContext = createContext<Student | null>(null)

export const PacketModalQuestionsContext = createContext<Array<EnrollmentQuestionTab>>([])
