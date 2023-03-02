import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import AddExcuseQuestionModal from '@mth/screens/Admin/HomeRoom/Components/AddNewQuestionModal/AddExcuseQuestionModal'
import { LearningLogQuestion } from '@mth/screens/Admin/HomeRoom/LearningLogs/types'

describe('Render Learning Log AddExcuseQuestionModal', () => {
  it('renders the create modal', () => {
    const { getByTestId } = render(<AddExcuseQuestionModal onClose={jest.fn()} onSave={jest.fn()} />)
    expect(getByTestId('excuse-question')).toBeInTheDocument()
  })

  it('renders the edit modal', () => {
    const editQuestionList: LearningLogQuestion[] = [
      {
        active: true,
        assignment_id: 1,
        default_question: false,
        id: 582,
        order: 1,
        page: 1,
        parent_slug: '',
        question: 'Please excuse this Weekly Learning Log.',
        response: '',
        slug: 'meta_1677613062297',
        type: 'AGREEMENT',
        validations: [],
      },
      {
        assignment_id: 1,
        validations: [],
        default_question: false,
        id: 583,
        active: false,
        order: 2,
        page: 1,
        parent_slug: 'meta_1677613062297',
        question: 'Please explain:',
        response: '',
        slug: 'meta_11677613062297',
        type: 'TEXTBOX',
      },
    ]
    const { getByTestId } = render(
      <AddExcuseQuestionModal onClose={jest.fn()} onSave={jest.fn()} editQuestionList={editQuestionList} />,
    )
    expect(getByTestId('excuse-question')).toBeInTheDocument()
  })
})
