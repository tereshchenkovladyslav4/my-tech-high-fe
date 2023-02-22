import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { teachersMock } from '@mth/mocks/teachersMock'
import { HomeroomSection } from '@mth/screens/Teacher/components/HomeroomSection/HomeroomSection'

describe('HomeroomSectionComponent', () => {
  it('should render homeroomSectionComponent', async () => {
    const mocks = teachersMock
    const props = {
      title: 'Homerooms',
      teachers: mocks,
    }
    const { getByTestId } = render(<HomeroomSection {...props} />)
    await waitFor(() => {
      expect(getByTestId('teacherHomeroomTitle')).toHaveTextContent('Homerooms')
    })
  })
})
