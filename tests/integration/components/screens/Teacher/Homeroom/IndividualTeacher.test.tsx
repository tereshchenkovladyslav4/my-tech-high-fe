import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import IndividualTeacher from '@mth/screens/Teacher/Homeroom/IndividualTeacher'

describe('IndividualTeacher', () => {
  it('should render IndividualTeacherHomeroom', async () => {
    render(<IndividualTeacher />)
  })
})
