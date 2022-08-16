import { MthColor } from '@mth/enums'

export const headerComponentClassess = {
  pageTop: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTopRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '24px',
  },
  pageTitle: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
  cancelBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    background: MthColor.RED_GRADIENT,
    color: 'white',
    width: '92px',
    marginRight: 2,
    height: '33px',
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  saveBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: MthColor.BLUE_GRDIENT,
    color: 'white',
    width: '92px',
    marginRight: 2,
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  arrowButton: {
    fontSize: '18px',
    stroke: 'black',
    strokeWidth: 2,
    margin: '3px 4px 3px 2px',
  },
}
