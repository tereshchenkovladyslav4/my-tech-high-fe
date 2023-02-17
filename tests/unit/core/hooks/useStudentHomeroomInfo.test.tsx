/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { renderHook } from '@testing-library/react-hooks'
import { useStudentHomeroomInfo } from '@mth/hooks/useStudentHomeroomInfo'
import { StudentHomeroomInfoQueryMock, StudentHomeroomInfoQueryWarningMock } from '@mth/mocks/studentHomeroomInfoMock'

describe('useStudentHomeroomInfo custom hook', () => {
  function getHookWrapper(mocks: any) {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useStudentHomeroomInfo(3341, 19), { wrapper })
    return { result, waitForNextUpdate }
  }

  it('should return an array of dropdownItems', async () => {
    // Working correctly
    const { result, waitForNextUpdate } = getHookWrapper(StudentHomeroomInfoQueryMock)

    await waitForNextUpdate()

    expect(result.current.teacherName).toBeDefined()
    expect(result.current.className).toBeDefined()
    expect(result.current.teacherName).toBe('Primary Teacher')
    expect(result.current.className).toBe('Makerspace')
  })

  it('should return an empty array when ueslazyquery failed ', async () => {
    // Not working
    const { result, waitForNextUpdate } = getHookWrapper(StudentHomeroomInfoQueryWarningMock)

    await waitForNextUpdate()

    expect(result.current.teacherName).toBeDefined()
    expect(result.current.className).toBeDefined()
    expect(result.current.teacherName).toBe('')
    expect(result.current.className).toBe('')
  })
})
