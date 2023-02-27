import { render, screen, fireEvent } from '@testing-library/react'
import { Instructions } from '@mth/components/Instructions'
import '@testing-library/jest-dom'

describe('Instructions', () => {
  const defaultProps = {
    description: 'Test description',
  }

  it('renders the component with the provided description', () => {
    render(<Instructions {...defaultProps} />)
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('expands the component when the subtitle is clicked', async () => {
    const { getByTestId } = render(<Instructions {...defaultProps} />)
    expect(getByTestId('ExpandLessIcon')).toBeInTheDocument()
    const clicked = await fireEvent.click(screen.getByText('Instructions'))
    if (clicked) expect(getByTestId('ExpandMoreIcon')).toBeInTheDocument()
  })

  it('calls the handleSaveAction prop when the edit button is clicked', () => {
    const handleSaveAction = jest.fn()
    render(<Instructions {...defaultProps} isEditable handleSaveAction={handleSaveAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('presentation')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(handleSaveAction).toHaveBeenCalled()
  })
})
