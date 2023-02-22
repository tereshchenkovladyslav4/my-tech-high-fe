import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MultipleTeacherHomeroom } from '@mth/screens/Teacher'

describe('MultipleTeachers', () => {
  it('should render MultipleTeacherHomeroom', async () => {
    render(<MultipleTeacherHomeroom />)
  })
})
