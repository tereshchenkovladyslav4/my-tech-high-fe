import { MthColor } from '@mth/enums'

export const headerClassess = {
  pageHeader: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageHeaderContent: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
  pageHeaderButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    marginRight: '24px',
  },
  emailButton: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    background: MthColor.RED_GRADIENT,
    color: 'white',
    width: '157px',
    marginRight: 2,
    height: '33px',
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  withdrawalButton: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: MthColor.YELLOW_GRADIENT,
    color: 'white',
    width: '195px',
    marginRight: 2,
    '&:hover': {
      background: '#FFD626',
      color: '#fff',
    },
  },
  reinstateButton: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: MthColor.GREEN_GRADIENT,
    color: 'white',
    width: '195px',
    '&:hover': {
      background: '#33FF7C',
      color: 'fff',
    },
  },
}
