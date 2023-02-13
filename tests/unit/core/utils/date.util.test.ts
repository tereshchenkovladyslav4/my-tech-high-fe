import { showDate } from '@mth/utils/date.util'

describe('showDate', () => {
  it('should return the original date without considering the timezone', () => {
    expect(showDate('2023-02-13')).toBe('02/13/2023')
    expect(showDate('')).toBe('')
    expect(showDate(undefined)).toBe('')
  })
})
