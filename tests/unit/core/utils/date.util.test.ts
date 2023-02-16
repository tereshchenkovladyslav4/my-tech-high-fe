import { getTimezoneOffsetStr, showDate } from '@mth/utils/date.util'

describe('showDate', () => {
  it('should return the original date without considering the timezone', () => {
    expect(showDate('2023-02-13')).toBe('02/13/2023')
    expect(showDate('')).toBe('')
    expect(showDate(undefined)).toBe('')
  })
})
describe('getTimezoneOffsetStr', () => {
  it('should return the timezone offset string from the timezone offset number', () => {
    expect(getTimezoneOffsetStr(0)).toBe('+0:0')
    expect(getTimezoneOffsetStr(240)).toBe('-4:0')
    expect(getTimezoneOffsetStr(-270)).toBe('+4:30')
  })
})
