import { render, cleanup } from '@testing-library/react'

import '@testing-library/jest-dom'
import { Card } from '@mth/components/Card/Card'

afterEach(cleanup)

describe('Card component', () => {
  it('It renders a Card', async () => {
    render(<Card />)
  })
})
