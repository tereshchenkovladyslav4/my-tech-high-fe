import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'

describe('Paragraph', () => {
  it('Renders the text in 14 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Paragraph size='large'>{text}</Paragraph>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 14px')
  })

  it('Renders the text in 12 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Paragraph size='medium'>{text}</Paragraph>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 12px')
  })

  it('Renders the text in 10 size font', () => {
    const text = 'Hello World'
    const { getByText } = render(<Paragraph>{text}</Paragraph>)
    expect(getByText(text)).toBeInTheDocument()
    expect(getByText(text)).toHaveStyle('font-size: 10px')
  })
})
