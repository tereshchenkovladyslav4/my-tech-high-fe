import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RoleLevel } from '@mth/enums'
import {
  checkListQueryMock,
  checkListQueryWrongMock,
  questionMock,
} from '@mth/mocks/independentChecklistQuestionItemMock'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { IndependentQuestionItem } from '@mth/screens/HomeroomStudentProfile/StudentHomeroom/LearningLogs/IndependentQuestionItem'

describe('IndependentQuestionItem', () => {
  const handleChangeValue = jest.fn()
  const mockAdmin: UserInfo = {
    user_id: 1,
    role: {
      level: RoleLevel.SUPER_ADMIN,
      id: 1,
      name: 'Super Admin',
    },
    selectedRegionId: 1,
    masquerade: true,
  }

  const mockAdminContext = {
    me: mockAdmin,
    setMe: jest.fn(),
  }

  const mockParent: UserInfo = {
    user_id: 1,
    role: {
      level: 2,
      id: 1,
      name: 'Parent',
    },
    userRegion: [
      {
        region_id: 1,
        regionDetail: {
          id: 1,
          name: 'Arizona',
          program: 'string',
          state_logo: 'string',
          special_ed: true,
          birth_date: '2022-06-10',
          resource_confirm_details: 'details',
          SchoolDistricts: [],
        },
      },
    ],
    masquerade: true,
  }

  const mockParentContext = {
    me: mockParent,
    setMe: jest.fn(),
  }
  test('renders correctly with user context and correct useLazyQuery for Admin', async () => {
    const { getByText } = render(
      <MockedProvider mocks={checkListQueryMock} addTypename={false}>
        <UserContext.Provider value={mockAdminContext}>
          <IndependentQuestionItem
            question={questionMock}
            schoolYearId={19}
            showError={false}
            handleChangeValue={handleChangeValue}
          />
        </UserContext.Provider>
      </MockedProvider>,
    )
    await waitFor(() => {
      expect(getByText('test')).toBeInTheDocument()
      expect(getByText('Depth of knowledge across multiple subject areas')).toBeInTheDocument()
      expect(getByText('Physical, social, mental, and emotional well-being')).toBeInTheDocument()
      expect(getByText('Civic responsibility, integrity, and community service')).toBeInTheDocument()
      fireEvent.click(getByText('Depth of knowledge across multiple subject areas'))
      expect(handleChangeValue).toHaveBeenCalledWith({
        ...questionMock,
        answer: '["456"]',
      })
      expect(getByText('Independent Question Test *')).toBeInTheDocument()
    })
  })

  test('should be rendered empty question list with user context and wrong useLazyQuery for Admin', async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={mockAdminContext}>
        <MockedProvider mocks={checkListQueryWrongMock} addTypename={false}>
          <IndependentQuestionItem
            question={questionMock}
            schoolYearId={19}
            showError={false}
            handleChangeValue={handleChangeValue}
          />
        </MockedProvider>
      </UserContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId('independent-question')).toBeInTheDocument()
    })
  })

  test('renders correctly with user context and correct useLazyQuery for Parent', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockParentContext}>
        <MockedProvider mocks={checkListQueryMock} addTypename={false}>
          <IndependentQuestionItem
            question={questionMock}
            schoolYearId={19}
            showError={false}
            handleChangeValue={handleChangeValue}
          />
        </MockedProvider>
      </UserContext.Provider>,
    )

    await waitFor(() => {
      expect(getByText('test')).toBeInTheDocument()
      expect(getByText('Depth of knowledge across multiple subject areas')).toBeInTheDocument()
      expect(getByText('Physical, social, mental, and emotional well-being')).toBeInTheDocument()
      expect(getByText('Civic responsibility, integrity, and community service')).toBeInTheDocument()
      fireEvent.click(getByText('Physical, social, mental, and emotional well-being'))
      expect(handleChangeValue).toHaveBeenCalledWith({
        ...questionMock,
        answer: '["455"]',
      })
      expect(getByText('Independent Question Test *')).toBeInTheDocument()
    })
  })

  test('should be rendered empty question list with user context and wrong useLazyQuery for Parent', async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={mockParentContext}>
        <MockedProvider mocks={checkListQueryWrongMock} addTypename={false}>
          <IndependentQuestionItem
            question={questionMock}
            schoolYearId={19}
            showError={false}
            handleChangeValue={handleChangeValue}
          />
        </MockedProvider>
      </UserContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId('independent-question')).toBeInTheDocument()
    })
  })
})
