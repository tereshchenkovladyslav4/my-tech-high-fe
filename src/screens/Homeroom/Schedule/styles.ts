import BGSVG from '@mth/assets/AdminApplicationBG.svg'
import { MthColor } from '@mth/enums'

export const scheduleClassess = {
  container: {
    backgroundImage: `url(${BGSVG})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '730px',
  },
  button: {
    borderRadius: 2,
    fontSize: 12,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    width: 140,
    height: 48,
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
      color: 'white',
    },
  },
  submitBtn: {
    borderRadius: 2,
    fontSize: 12,
    background: MthColor.BLACK_GRADIENT,
    width: 140,
    height: 48,
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      background: MthColor.BLACK_MOUSEOVER,
      color: 'white',
    },
  },
}
