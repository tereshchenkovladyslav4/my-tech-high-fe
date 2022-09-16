export enum QUESTION_TYPE {
  DROPDOWN = 1,
  TEXTFIELD,
  CHECKBOX,
  AGREEMENT,
  MULTIPLECHOICES,
  CALENDAR,
  INFORMATION,
  UPLOAD,
  SIGNATURE,
}

export const QuestionTypes = [
  {
    value: QUESTION_TYPE.DROPDOWN,
    label: 'Drop Down',
  },
  {
    value: QUESTION_TYPE.TEXTFIELD,
    label: 'Text Field',
  },
  {
    value: QUESTION_TYPE.CHECKBOX,
    label: 'Checkbox',
  },
  {
    value: QUESTION_TYPE.AGREEMENT,
    label: 'Agreement',
  },
  {
    value: QUESTION_TYPE.MULTIPLECHOICES,
    label: 'Multiple Choices',
  },
  {
    value: QUESTION_TYPE.CALENDAR,
    label: 'Calendar',
  },
  {
    value: QUESTION_TYPE.INFORMATION,
    label: 'Information',
  },
]

export enum HasAdditionalQuestion {
  YES = 2,
  NO = 1,
}

export enum ValidationType {
  NONE = 0,
  NUMBER = 1,
  EMAIL = 2,
}

export type QuestionOption = {
  label: string
  value: string
  action: HasAdditionalQuestion
}

export type Question = {
  id: number
  region_id: number
  section: string
  type: QUESTION_TYPE
  sequence: number
  question: string
  options: QuestionOption[]
  slug: string
  mainQuestion: boolean //	Shows if this question is from System or not, false => Admin created, true => Comes from system prototype
  defaultQuestion: boolean //	false => Custom Question, true => Default Question
  validation: ValidationType
  required: boolean
  additionalQuestion: string //	The slug of parent question for Additional Question

  response: string | number | boolean //	Available for parents only
  studentId?: number
}

export interface QuestionProps {
  item: Question
  action: boolean
  onAction?: (evt_type: string) => void
}

export interface DefaultQuestion {
  question: string
  type: QUESTION_TYPE
  slug: string
  validation?: number
}

export const defaultQuestions: DefaultQuestion[] = [
  {
    question: 'Parent Preferred First Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_preferred_first_name',
  },
  {
    question: 'Parent Preferred Last Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_preferred_last_name',
  },
  {
    question: 'Parent Legal First Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_first_name',
  },
  {
    question: 'Parent Legal Last Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_last_name',
  },
  {
    question: 'Secondary Parent First Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'packet_secondary_contact_first',
  },
  {
    question: 'Secondary Parent Last Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'packet_secondary_contact_last',
  },
  {
    question: 'Phone Number',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_phone_number',
    validation: 1,
  },
  {
    question: 'Parent Email',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_email',
    validation: 2,
  },
  {
    question: 'Student Legal First Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_first_name',
  },
  {
    question: 'Student Legal Last Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_last_name',
  },
  {
    question: 'Student Legal Middle Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_middle_name',
  },
  {
    question: 'Student Preferred First Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_preferred_first_name',
  },
  {
    question: 'Student Preferred Last Name',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_preferred_last_name',
  },
  {
    question: 'Student Grade Level',
    type: QUESTION_TYPE.DROPDOWN,
    slug: 'student_grade_level',
  },
  {
    question: 'Street',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'address_street',
  },
  {
    question: 'Street 2',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'address_street2',
  },
  {
    question: 'City',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'address_city',
  },
  {
    question: 'State',
    type: QUESTION_TYPE.DROPDOWN,
    slug: 'address_state',
  },
  {
    question: 'Zip Code',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'address_zip',
    validation: 1,
  },
  {
    question: 'Student Date of Birth',
    type: QUESTION_TYPE.CALENDAR,
    slug: 'student_date_of_birth',
  },
  {
    question: 'Student Gender',
    type: QUESTION_TYPE.MULTIPLECHOICES,
    slug: 'student_gender',
  },
  {
    question: 'School District',
    type: QUESTION_TYPE.DROPDOWN,
    slug: 'packet_school_district',
  },
  {
    question: 'County',
    type: QUESTION_TYPE.DROPDOWN,
    slug: 'address_county_id',
  },
  {
    question: 'Parent Email Confirmation',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'parent_emailConfirm',
  },
  {
    question: 'Student Email',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_email',
    validation: 2,
  },
  {
    question: 'Student Email Confirmation',
    type: QUESTION_TYPE.TEXTFIELD,
    slug: 'student_emailConfirm',
    validation: 2,
  },
  // {
  //   question: 'Program Year',
  //   type: QUESTION_TYPE.DROPDOWN,
  //   slug: 'program_year',
  // },
]
