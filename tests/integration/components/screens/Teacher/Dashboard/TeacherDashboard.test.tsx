import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { classesTeacherMock } from '@mth/mocks/classesTeacherMock'
import { TeacherDashboard } from '@mth/screens/Teacher'

describe('TeacherDashboard', () => {
  it('should render TeacherDashboard', async () => {
    const mocks = [classesTeacherMock]
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TeacherDashboard />
      </MockedProvider>,
    )
  })
})
