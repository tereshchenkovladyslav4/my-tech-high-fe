import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { teachersMock } from '@mth/mocks/teachersMock'
import { TeacherItem } from '@mth/screens/Teacher/components/TeacherItem'

describe('TeacherItemComponent', () => {
  it('should render teacherItem', async () => {
    const mocks = teachersMock
    const props = {
      teacher: mocks[0],
    }
    const { getByTestId } = render(<TeacherItem {...props} />)
    await waitFor(() => {
      expect(getByTestId('ungradedLogsNumber')).toHaveTextContent(/[0-9]+/)
    })
    await waitFor(() => {
      expect(getByTestId('exclamationMark')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('clickToHomeroom')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('circleProgress')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('teacherIcon')).toBeInTheDocument()
    })
  })
})
