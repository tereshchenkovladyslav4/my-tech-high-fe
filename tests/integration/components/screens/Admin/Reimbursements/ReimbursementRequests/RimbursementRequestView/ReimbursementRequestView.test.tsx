import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { reimbursementRequestMock } from '@mth/mocks/reimbursementRequestMock'
import { ReimbursementRequestView } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView'

describe('ReimbursementRequestView', () => {
  it('should render ReimbursementRequestView', async () => {
    const mocks = [reimbursementRequestMock]

    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReimbursementRequestView reimbursementRequestId={1} />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(getByTestId('pageHeaderBack')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('pageHeaderTitle')).toHaveTextContent('Requests')
    })
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
    await waitFor(() => {
      expect(getByTestId('requestFormTitle')).toHaveTextContent('Request for Reimbursement')
    })
  })
})
