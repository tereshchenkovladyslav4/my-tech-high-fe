import { render, cleanup } from '@testing-library/react'

import '@testing-library/jest-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { dropdownMock } from '../../../mocks/dropdownMock'

afterEach(cleanup)

describe('DropDown component', () => {
  it('It renders a DropDown', async () => {
    const mock = dropdownMock[0]
    render(<DropDown {...mock} />)
  })
  it('The text color is blue', async () => {
    const colorMock = { ...dropdownMock[1] }
    const placeholder = 'Select with blue'
    const { getByText } = render(<DropDown {...colorMock} />)

    expect(getByText(placeholder)).toBeInTheDocument()
    const styles = getComputedStyle(getByText(placeholder))
    expect(styles.color).toBe('rgb(25, 118, 210)')
  })
})
