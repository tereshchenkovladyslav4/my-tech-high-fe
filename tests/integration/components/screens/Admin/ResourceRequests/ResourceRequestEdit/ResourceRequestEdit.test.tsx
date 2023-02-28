import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { resourceRequests } from '@mth/mocks/resourceRequestsMock'
import { ResourceRequestEdit } from '@mth/screens/Admin/ResourceRequests/ResourceRequestEdit'

describe('ResourceRequestEdit', () => {
  it('should render ResourceRequestEdit', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Router>
          <ResourceRequestEdit item={resourceRequests[0]} refetch={() => {}} setShowEditModal={() => {}} />
        </Router>
      </MockedProvider>,
    )

    expect(getByTestId('cancelBtn')).toBeInTheDocument()
    expect(getByTestId('saveBtn')).toBeInTheDocument()
    expect(getByTestId('firstName')).toBeInTheDocument()
    expect(getByTestId('lastName')).toBeInTheDocument()
    expect(getByTestId('vendor')).toBeInTheDocument()
    expect(getByTestId('resourceLevel')).toBeInTheDocument()
    expect(getByTestId('username')).toBeInTheDocument()
    expect(getByTestId('password')).toBeInTheDocument()
  })
})
