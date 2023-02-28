import { urlPrefixRex } from '@mth/constants'

export const convertExternalUrl = (url: string | undefined | null): string => {
  if (!url) return ''
  if (urlPrefixRex.test(url)) return url
  return `//${url}`
}
