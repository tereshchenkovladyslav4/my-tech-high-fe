import { MockedProvider } from '@apollo/client/testing'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QuestionTypes } from '@mth/constants'
import { reimbursementRequestMock } from '@mth/mocks/reimbursementRequestMock'
import { LearningLogQuestion } from '@mth/models'
import { LearningLogQuestionItem } from '@mth/screens/HomeroomStudentProfile/StudentHomeroom/LearningLogs/LearningLogQuestionItem'

describe('LearningLogQuestionItem', () => {
  const handleChangeValue = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders a textbox question', () => {
    const question: LearningLogQuestion = {
      id: 1,
      type: QuestionTypes.TEXTBOX,
      question: 'What is your name?',
      required: true,
      answer: '',
      page: 0,
      order: 0,
    }

    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    const title = screen.getByText('What is your name? *')
    expect(title).toBeInTheDocument()
  })

  test('renders a dropdown question', async () => {
    const question: LearningLogQuestion = {
      id: 2,
      type: QuestionTypes.DROPDOWN,
      question: 'What is your favorite color?',
      required: true,
      answer: 'Red',
      Options: [
        { value: 'Red', label: 'Red' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Green', label: 'Green' },
      ],
      page: 0,
      order: 0,
    }

    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    const dropdownInput = screen.getByText('Red')
    expect(dropdownInput).toBeInTheDocument()
    expect(screen.getByText('What is your favorite color? *')).toBeInTheDocument()
  })

  test('renders an agreement question', () => {
    const question: LearningLogQuestion = {
      id: 3,
      type: QuestionTypes.AGREEMENT,
      question: 'Do you agree to the terms and conditions?',
      required: true,
      answer: false,
      page: 0,
      order: 0,
    }

    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    const agreementCheckbox = screen.getByRole('checkbox')
    expect(agreementCheckbox).toBeInTheDocument()
    fireEvent.click(agreementCheckbox)
    expect(handleChangeValue).toHaveBeenCalledWith({ ...question, answer: true })
  })

  test('renders an information question', () => {
    const question: LearningLogQuestion = {
      id: 4,
      type: QuestionTypes.INFORMATION,
      question: 'This is an information question.',
      page: 0,
      order: 0,
    }
    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    const informationText = screen.getByText('This is an information question.')
    expect(informationText).toBeInTheDocument()
  })

  test('renders an upload question', () => {
    const question: LearningLogQuestion = {
      id: 5,
      type: QuestionTypes.UPLOAD,
      question: 'Upload your essay.',
      required: true,
      answer: '',
      page: 0,
      order: 0,
    }
    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    const uploadText = screen.getByText('Upload your essay. *')
    expect(uploadText).toBeInTheDocument()
    expect(screen.getByTestId('upload-button')).toBeInTheDocument()
  })

  test('renders an multi chose question', () => {
    const question: LearningLogQuestion = {
      id: 5,
      type: QuestionTypes.MULTIPLE_CHOSE,
      question: 'Please choose color.',
      required: true,
      Options: [
        { value: true, label: 'Red', option_id: 1 },
        { value: false, label: 'Blue', option_id: 2 },
        { value: false, label: 'Black', option_id: 3 },
      ],
      answer: '',
      page: 0,
      order: 0,
    }
    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
    expect(screen.getByText('Black')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Black'))
    expect(handleChangeValue).toHaveBeenCalledWith({
      ...question,
      answer:
        '[{"label":"Red","value":false,"action":1,"option_id":1},{"label":"Blue","value":false,"action":1,"option_id":2},{"label":"Black","value":true,"action":1,"option_id":3}]',
    })
    expect(screen.getByText('Please choose color. *')).toBeInTheDocument()
  })

  test('renders an checkbox list question', () => {
    const question: LearningLogQuestion = {
      id: 5,
      type: QuestionTypes.CHECK_BOX,
      question: 'Please select color.',
      required: true,
      Options: [
        { value: 'red', label: 'Red', action: 1 },
        { value: 'blue', label: 'Blue', action: 1 },
        { value: 'black', label: 'Black', action: 1 },
      ],
      answer: '',
      page: 0,
      order: 0,
    }
    render(
      <LearningLogQuestionItem
        question={question}
        schoolYearId={1}
        showError={false}
        handleChangeValue={handleChangeValue}
      />,
    )
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
    expect(screen.getByText('Black')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Black'))
    expect(handleChangeValue).toHaveBeenCalledWith({
      ...question,
      answer: '["black"]',
    })
    expect(screen.getByText('Please select color. *')).toBeInTheDocument()
  })

  it('should render Subject Checklist Question Item', async () => {
    const mocks = [reimbursementRequestMock]
    const question: LearningLogQuestion = {
      id: 5,
      type: QuestionTypes.SUBJECT_QUESTION,
      question: 'Select one or more of the competencies you were developing this week, if interested.',
      required: true,
      answer: '',
      page: 1,
      order: 1,
    }
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LearningLogQuestionItem
          question={question}
          schoolYearId={1}
          showError={false}
          handleChangeValue={handleChangeValue}
        />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(
        getByText('Select one or more of the competencies you were developing this week, if interested. *'),
      ).toBeInTheDocument()
    })
  })

  it('should render Independent Checklist Question Item', async () => {
    const mocks = [reimbursementRequestMock]
    const question: LearningLogQuestion = {
      id: 5,
      type: QuestionTypes.INDEPENDENT_QUESTION,
      question: 'Select one or more of the competencies you were developing this week, if interested.',
      required: true,
      answer: '',
      page: 1,
      order: 1,
    }
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LearningLogQuestionItem
          question={question}
          schoolYearId={1}
          showError={false}
          handleChangeValue={handleChangeValue}
        />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(getByTestId('independent-question')).toBeInTheDocument()
    })
  })
})
