import { getWindowDimension } from '@mth/utils/window.util'

describe('getWindowDimension', () => {
  it('should return window dimension', () => {
    const { width, height } = getWindowDimension()
    expect(width).toBe(window.innerWidth)
    expect(height).toBe(window.innerHeight)
  })
})
