import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Title } from '@mth/components/Typography/Title/Title'

describe('Subtitle', () => {
  it('Renders the text in 14 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Title size='large'>{text}</Title>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 32px')
  })

  it('Renders the text in 12 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Title size='medium'>{text}</Title>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 28px')
  })

  it('Renders the text in 10 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Title>{text}</Title>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 24px')
  })
})
