/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { renderHook } from '@testing-library/react-hooks'
import { useLearningLogQuestionsByAssignmentId } from '@mth/hooks/useLearningLogQuestionsByAssignmentId'
import { learningLogQuestionsQueryMock, learningLogQuestionsQueryWrongMock } from '@mth/mocks/learningLogQuestionsMock'

describe('useLearningLogQuestionsByAssignmentId custom hook', () => {
  function getHookWrapper(mocks: any) {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useLearningLogQuestionsByAssignmentId(1), { wrapper })
    return { result, waitForNextUpdate }
  }

  it('should return an array of learningLogQuestions', async () => {
    // Working correctly
    const { result, waitForNextUpdate } = getHookWrapper(learningLogQuestionsQueryMock)

    await waitForNextUpdate()

    expect(result.current.learningLogQuestions).toBeDefined()
    expect(result.current.learningLogQuestions.length).toBe(2)
    expect(typeof result.current.loading).toBe('boolean')
    expect(typeof result.current.learningLogQuestions).toBe('object')
    expect(typeof result.current.setLearingLogQuestions).toBe('function')
  })

  it('should return an empty array when ueslazyquery failed ', async () => {
    // Not working
    const { result, waitForNextUpdate } = getHookWrapper(learningLogQuestionsQueryWrongMock)

    await waitForNextUpdate()

    expect(result.current.learningLogQuestions).toBeDefined()
    expect(result.current.learningLogQuestions).toEqual([])
    expect(typeof result.current.loading).toBe('boolean')
    expect(typeof result.current.setLearingLogQuestions).toBe('function')
  })
})
