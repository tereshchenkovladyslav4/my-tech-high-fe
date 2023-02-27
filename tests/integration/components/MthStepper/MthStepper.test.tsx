import { render, screen, fireEvent } from '@testing-library/react'
import { MthStepper } from '@mth/components/MthStepper'

describe('MthStepper', () => {
  const defaultProps = {
    activeStep: 1,
    totalPageCount: 3,
    setSelectStep: jest.fn(),
  }

  it('renders the component with the correct number of steps', () => {
    render(<MthStepper {...defaultProps} />)
    const steps = screen.getAllByTestId('step')
    expect(steps.length).toBe(3)
  })

  it('calls the setSelectStep prop with the correct step when a step is clicked', () => {
    render(<MthStepper {...defaultProps} />)
    fireEvent.click(screen.getAllByTestId('stepLabel')[1])
    expect(defaultProps.setSelectStep).toHaveBeenCalledWith(1)
  })
})
