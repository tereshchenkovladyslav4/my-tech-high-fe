import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { reimbursementRequest } from '@mth/mocks/reimbursementRequestMock'
import { StudentInfo } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/StudentInfo'

describe('StudentInfo', () => {
  it('should render StudentInfo', async () => {
    const { getByTestId } = render(<StudentInfo request={reimbursementRequest}></StudentInfo>)

    await waitFor(() => {
      expect(getByTestId('studentName')).toHaveTextContent('Firstname Lastname')
    })
    await waitFor(() => {
      expect(getByTestId('studentGrade')).toHaveTextContent('5th Grade')
    })
    await waitFor(() => {
      expect(getByTestId('studentSchedule')).toHaveTextContent('Schedule')
    })
    await waitFor(() => {
      expect(getByTestId('midYearNotification')).toHaveTextContent('Mid-year Program')
    })
    await waitFor(() => {
      expect(getByTestId('gradeNotification')).toHaveTextContent('5th Grade')
    })
    await waitFor(() => {
      expect(getByTestId('statusDropdown')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('adminNote')).toHaveTextContent('Family notes entered from profile.')
    })
  })
})
