import { MthColor } from '@mth/enums'

export const eventDetailClassess = {
  clubButton: {
    mt: 1.5,
    background: '#2b9db72b',
    width: 'auto',
  },
  arrowButtonGroup: {
    marginTop: 4,
    display: 'flex',
  },
  saveBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '48px',
    background: MthColor.BLUE_GRADIENT,
    color: 'white',
    width: '140px',
    minWidth: '140px',
    marginRight: 4,
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  arrowButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '45px',
    height: '45px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginRight: 1,
  },
}
