import { GRADES } from '../../../../../utils/constants'
import { STATES_WITH_ID } from '../../../../../utils/states'

export const QuestionTypes = [
  {
    value: 1,
    label: 'Drop Down',
  },
  {
    value: 2,
    label: 'Text Field',
  },
  {
    value: 3,
    label: 'Checkbox',
  },
  {
    value: 4,
    label: 'Agreement',
  },
  {
    value: 5,
    label: 'Multiple Choices',
  },
  {
    value: 6,
    label: 'Calendar',
  },
  {
    value: 7,
    label: 'Information',
  },
]

export type OptionsType = { label: string; value: number, action: number }

export type ApplicationQuestion = {
  id?: number
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7
  question: string
  options?: OptionsType[]
  required: boolean
  order: number
  response?: string
  region_id?: number
  validation?: string
  student_question: boolean
  default_question: boolean
  slug: string,
  additional_question: string,
  main_question: number
}

export const initQuestions: ApplicationQuestion[] = [
  {
    id: 1,
    order: 1,
    type: 1,
    question: 'State',
    required: true,
    options: STATES_WITH_ID,
    validation: '',
    student_question: false,
    default_question: false,
    slug: 'state',
  },
  // {
  //   id: 2,
  //   order: 2,
  //   type: 1,
  //   question: 'Propgram Year',
  //   required: true,
  //   options: [
  //     {
  //       label: '2021-2022',
  //       value: 1,
  //     },
  //     {
  //       label: '2023-2024',
  //       value: 2,
  //     },
  //     {
  //       label: '2024-2025',
  //       value: 3,
  //     },
  //   ],
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 3,
  //   order: 3,
  //   type: 2,
  //   question: 'Parent First Name',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 4,
  //   order: 4,
  //   type: 2,
  //   question: 'Parent Last Name',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 5,
  //   order: 5,
  //   type: 2,
  //   question: 'Parent Phone',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 6,
  //   order: 6,
  //   type: 2,
  //   question: 'Parent Email',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 7,
  //   order: 7,
  //   type: 2,
  //   question: 'Parent Email Again',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 8,
  //   order: 8,
  //   type: 2,
  //   question: 'Student First Name',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 9,
  //   order: 9,
  //   type: 2,
  //   question: 'Student Last Name',
  //   required: true,
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
  // {
  //   id: 10,
  //   order: 10,
  //   type: 1,
  //   question: 'Student Grade Level As of September 1, 2021',
  //   required: true,
  //   options: GRADES.map((gr, i) => ({ label: gr + '', value: i + 1 })),
  //   validation: '',
  //   student_question: false,
  //   default_question: false,
  // },
]

export type StudentQuestion = {
  id: number
  type: 1 | 2 | 3 | 4 | 5
  question: string
  options?: OptionsType[]
  required: boolean
  order: number
  response?: string
}

export const initStudentQuestion: StudentQuestion[] = [
  {
    id: 1,
    order: 1,
    type: 2,
    question: 'If new to My Tech High, please tell us who referred you so we can thank them!Z',
    required: true,
  },
]
