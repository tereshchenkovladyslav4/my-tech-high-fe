/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { renderHook } from '@testing-library/react-hooks'
import { useActiveHomeroomSchoolYears } from '@mth/hooks/useActiveHomeroomSchoolYears'
import {
  ActiveStudentHomeroomSchoolYearsQueryMock,
  ActiveStudentHomeroomSchoolYearsQueryWrongMock,
} from '@mth/mocks/activeHomeroomSchoolYearsMock'

describe('useActiveHomeroomSchoolYears custom hook', () => {
  function getHookWrapper(mocks: any) {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useActiveHomeroomSchoolYears(3341), { wrapper })
    return { result, waitForNextUpdate }
  }

  it('should return an array of dropdownItems', async () => {
    // Working correctly
    const { result, waitForNextUpdate } = getHookWrapper(ActiveStudentHomeroomSchoolYearsQueryMock)

    await waitForNextUpdate()

    expect(result.current.dropdownItems).toBeDefined()
    expect(typeof result.current.loading).toBe('boolean')
    expect(result.current.error).toBeUndefined()
    expect(typeof result.current.dropdownItems).toBe('object')
    expect(typeof result.current.schoolYears).toBe('object')
    expect(typeof result.current.selectedYearId).toBe('number')
    expect(result.current.dropdownItems).toBeDefined()
    expect(result.current.schoolYears).toBeDefined()
    expect(result.current.selectedYear).toBeDefined()
    expect(result.current.selectedYearId).toBeDefined()
  })

  it('should return an empty array when ueslazyquery failed ', async () => {
    // Not working
    const { result, waitForNextUpdate } = getHookWrapper(ActiveStudentHomeroomSchoolYearsQueryWrongMock)

    await waitForNextUpdate()

    expect(result.current.dropdownItems).toBeDefined()
    expect(result.current.dropdownItems).toEqual([])
    expect(typeof result.current.loading).toBe('boolean')
    expect(result.current.error).toBeUndefined()
    expect(typeof result.current.dropdownItems).toBe('object')
    expect(typeof result.current.schoolYears).toBe('object')
    expect(typeof result.current.selectedYearId).toBe('undefined')
    expect(result.current.dropdownItems).toBeDefined()
    expect(result.current.schoolYears).toBeDefined()
    expect(result.current.selectedYear).toBeUndefined()
    expect(result.current.selectedYearId).toBeUndefined()
  })
})
