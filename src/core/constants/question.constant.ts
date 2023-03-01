export const QuestionTypes = {
  TEXTBOX: 'TEXTBOX',
  AGREEMENT: 'AGREEMENT',
  UPLOAD: 'UPLOAD',
  MULTIPLE_CHOSE: 'MULTIPLE_CHOSE',
  CHECK_BOX: 'CHECK_BOX',
  DROPDOWN: 'DROPDOWN',
  INFORMATION: 'INFORMATION',
  SUBJECT_QUESTION: 'SUBJECT_QUESTION',
  INDEPENDENT_QUESTION: 'INDEPENDENT_QUESTION',
}

// assignment
export const assignmentCustomQuestionTypes = [
  {
    value: QuestionTypes.TEXTBOX,
    label: 'Text box',
  },
  {
    value: QuestionTypes.AGREEMENT,
    label: 'Agreement',
  },
  {
    value: QuestionTypes.UPLOAD,
    label: 'Upload',
  },
  {
    value: QuestionTypes.MULTIPLE_CHOSE,
    label: 'Multiple Choice',
  },
  {
    value: QuestionTypes.CHECK_BOX,
    label: 'Checkbox',
  },
  {
    value: QuestionTypes.DROPDOWN,
    label: 'Dropdown',
  },
  {
    value: QuestionTypes.INFORMATION,
    label: 'Information',
  },
]

export const additionalAssignmentCustomQuestionTypes = [
  {
    value: QuestionTypes.TEXTBOX,
    label: 'Text box',
  },
  {
    value: QuestionTypes.MULTIPLE_CHOSE,
    label: 'Multiple Choice',
  },
  {
    value: QuestionTypes.CHECK_BOX,
    label: 'Checkbox',
  },
  {
    value: QuestionTypes.DROPDOWN,
    label: 'Dropdown',
  },
]

export const defaultExcuseAssignmentLog = 'Please excuse this Weekly Learning Log.'
export const defaultExcuseAssignmentExplain = 'Please explain:'

export const checkListDefaultQuestion =
  'Select one or more of the competencies you were developing this week, if interested.'
export const questionTextLengthError = 'Max Number of Characters Reached'
