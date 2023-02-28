import { convertExternalUrl } from '@mth/utils/url.util'

describe('convertExternalUrl', () => {
  it('should return the URL with a protocal', () => {
    expect(convertExternalUrl('')).toBe('')
    expect(convertExternalUrl(null)).toBe('')
    expect(convertExternalUrl(undefined)).toBe('')
    expect(convertExternalUrl('example.com')).toBe('//example.com')
    expect(convertExternalUrl('https://example.com')).toBe('https://example.com')
    expect(convertExternalUrl('http://example.com')).toBe('http://example.com')
  })
})
