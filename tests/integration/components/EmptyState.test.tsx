import { render } from '@testing-library/react'
import { EmptyState } from '@mth/components/EmptyState/EmptyState'
import '@testing-library/jest-dom'

describe('EmptyState', () => {
  it('should render Empty State', () => {
    const { getByText, getByAltText } = render(<EmptyState title='title' subtitle='subtitle' image='image' />)
    const image = getByAltText('Empty State Image')

    expect((image as HTMLImageElement).src).toContain('image')
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText('subtitle')).toBeInTheDocument()
  })
})
