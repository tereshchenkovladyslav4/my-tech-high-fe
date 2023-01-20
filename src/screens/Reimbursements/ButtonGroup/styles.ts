import { MthColor } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'

export const buttonGroupClasses = {
  button: {
    ...mthButtonClasses.primary,
    width: '100%',
    fontSize: '16px',
    fontWeight: '700',
    '&.Mui-disabled': { color: MthColor.LIGHTGRAY, pointerEvents: 'none', opacity: 0.5 },
  },
}
