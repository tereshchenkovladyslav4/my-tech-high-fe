import { MthColor } from '@mth/enums'

export const checkListClass = {
  flexCenterBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitBtn: {
    borderRadius: 2,
    fontSize: 12,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    width: 160,
    height: 37,
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
      color: 'white',
    },
  },
  tooltipBtn: {
    backgroundColor: '#767676',
    fontSize: '16px',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 9,
    paddingBottom: 9,
  },
}
