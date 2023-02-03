import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'

describe('Subtitle', () => {
  it('Renders the text in 14 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Subtitle size='large'>{text}</Subtitle>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 20px')
  })

  it('Renders the text in 12 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Subtitle size='medium'>{text}</Subtitle>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 18px')
  })

  it('Renders the text in 10 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Subtitle>{text}</Subtitle>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 16px')
  })
})
