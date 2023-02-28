import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { me } from '@mth/mocks/meMock'
import { resourceRequestsMock } from '@mth/mocks/resourceRequestsMock'
import { schoolYears, schoolYearsByRegionIdMock } from '@mth/mocks/schoolYearsByRegionIdMock'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ResourceRequestsTable } from '@mth/screens/Admin/ResourceRequests/ResourceRequestsTable'

describe('ResourceRequestsTable', () => {
  it('should render ResourceRequestsTable', async () => {
    const mocks = [schoolYearsByRegionIdMock, resourceRequestsMock]

    const { getByTestId } = render(
      <UserContext.Provider value={{ me: { ...me, selectedRegionId: 1 }, setMe: () => {} }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ResourceRequestsTable
            schoolYearId={19}
            setSchoolYearId={() => {}}
            schoolYear={schoolYears[0]}
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
      expect(getByTestId('downloadBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('acceptBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('removeBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('deleteBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('importBtn')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('pagination')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(getByTestId('tableCell-0-created_at')).toHaveTextContent('01/09/2023')
      expect(getByTestId('tableCell-0-lastname')).toHaveTextContent('demo1')
      expect(getByTestId('tableCell-0-firstname')).toHaveTextContent('agetest')
      expect(getByTestId('tableCell-0-grade')).toHaveTextContent('1')
      expect(getByTestId('tableCell-0-email')).toHaveTextContent('nairan+agetest@codev.com')
      expect(getByTestId('tableCell-0-vendor')).toHaveTextContent('748 demo')
      expect(getByTestId('tableCell-0-status')).toHaveTextContent('Accepted')
      expect(getByTestId('tableCell-0-cost')).toHaveTextContent('$10')
      expect(getByTestId('tableCell-0-emailed')).toBeInTheDocument()
    })
  })
})
