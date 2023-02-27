import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import InstructionsEditModal from '@mth/components/Instructions/InstructionsEditModal'

describe('InstructionsEditModal', () => {
  const defaultProps = {
    description: 'Test description',
    handleClose: jest.fn(),
    handleSave: jest.fn(),
  }

  it('renders the component with the provided description', async () => {
    render(<InstructionsEditModal {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('calls the handleClose prop when the cancel button is clicked', () => {
    render(<InstructionsEditModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(defaultProps.handleClose).toHaveBeenCalled()
  })

  it('calls the handleSave prop with the edited description when the save button is clicked', () => {
    render(<InstructionsEditModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(defaultProps.handleSave).toHaveBeenCalledWith('Test description')
  })
})
