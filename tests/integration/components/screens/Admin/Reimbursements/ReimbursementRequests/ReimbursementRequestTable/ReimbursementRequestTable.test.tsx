import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { me } from '@mth/mocks/meMock'
import { reimbursementRequestsMock } from '@mth/mocks/reimbursementRequestsMock'
import { schoolYearsByRegionIdMock } from '@mth/mocks/schoolYearsByRegionIdMock'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ReimbursementRequestTable } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestTable'

describe('ReimbursementRequestTable', () => {
  it('should render ReimbursementRequestTable', async () => {
    const mocks = [schoolYearsByRegionIdMock, reimbursementRequestsMock]

    const { getByTestId } = render(
      <UserContext.Provider value={{ me: { ...me, selectedRegionId: 1 }, setMe: () => {} }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ReimbursementRequestTable
            schoolYearId={19}
            setSchoolYearId={() => {}}
            setSchoolYear={() => {}}
            filter={{}}
          />
        </MockedProvider>
      </UserContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId('pageTitle')).toHaveTextContent('Requests')
    })
    await waitFor(() => {
      expect(getByTestId('totalCnt')).toHaveTextContent('1')
    })
    await waitFor(() => {
      expect(getByTestId('search')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('emailBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('schoolYearDropdown')).toHaveTextContent('2022-23')
    })
    await waitFor(() => {
      expect(getByTestId('payBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('deleteBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('pagination')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('tableCell-0-date_submitted')).toHaveTextContent('02/21/2023')
      expect(getByTestId('tableCell-0-total_amount')).toHaveTextContent('$3526.26')
      expect(getByTestId('tableCell-0-studentName')).toHaveTextContent('StudentLastname, StudentFirstname')
      expect(getByTestId('tableCell-0-grade')).toHaveTextContent('K')
      expect(getByTestId('tableCell-0-parentName')).toHaveTextContent('ParentLastname, ParentFirstname')
      expect(getByTestId('tableCell-0-requestStatus')).toHaveTextContent('Submitted')
      expect(getByTestId('tableCell-0-date_paid')).toBeInTheDocument()
      expect(getByTestId('tableCell-0-form_type')).toHaveTextContent('Technology Allowance')
      expect(getByTestId('tableCell-0-periods')).toBeInTheDocument()
      expect(getByTestId('tableCell-0-request')).toHaveTextContent('RB')
      expect(getByTestId('tableCell-0-emailed')).toBeInTheDocument()
    })
  })
})
