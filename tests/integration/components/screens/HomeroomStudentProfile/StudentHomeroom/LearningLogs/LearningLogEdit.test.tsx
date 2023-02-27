import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { learningLogQuestionsQueryMock } from '@mth/mocks/learningLogQuestionsMock'
import { LearningLogEdit } from '@mth/screens/HomeroomStudentProfile/StudentHomeroom/LearningLogs/LearningLogEdit'

describe('LearningLogEdit', () => {
  test('renders the page number', () => {
    render(
      <MockedProvider mocks={learningLogQuestionsQueryMock} addTypename={false}>
        <LearningLogEdit
          learningLog={{
            id: 1,
            master_id: 1,
            title: 'Test',
            due_date: '2023-02-24',
            reminder_date: '2023-02-24',
            auto_grade: '2023-02-24',
            auto_grade_email: 1,
            teacher_deadline: '2023-02-24',
            page_count: 5,
          }}
          schoolYearId={19}
          setSelectedLearningLog={() => {}}
        />
      </MockedProvider>,
    )
    expect(screen.getByText('1/5')).toBeInTheDocument()
  })

  test('clicks Next button to go to the next page', () => {
    render(
      <MockedProvider mocks={learningLogQuestionsQueryMock} addTypename={false}>
        <LearningLogEdit
          learningLog={{
            id: 1,
            master_id: 1,
            title: 'Test',
            due_date: '2023-02-24',
            reminder_date: '2023-02-24',
            auto_grade: '2023-02-24',
            auto_grade_email: 1,
            teacher_deadline: '2023-02-24',
            page_count: 5,
          }}
          schoolYearId={2022}
          setSelectedLearningLog={() => {}}
        />
      </MockedProvider>,
    )

    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('2/5')).toBeInTheDocument()
  })

  test('appear Submit button to submit the learning log', () => {
    render(
      <MockedProvider mocks={learningLogQuestionsQueryMock} addTypename={false}>
        <LearningLogEdit
          learningLog={{
            id: 1,
            master_id: 1,
            title: 'Test',
            due_date: '2023-02-24',
            reminder_date: '2023-02-24',
            auto_grade: '2023-02-24',
            auto_grade_email: 1,
            teacher_deadline: '2023-02-24',
            page_count: 5,
          }}
          schoolYearId={2022}
          setSelectedLearningLog={() => {}}
        />
      </MockedProvider>,
    )
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})
