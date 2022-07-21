import { BLUE_GRDIENT, RED_GRADIENT } from '../../../../utils/constants'

export const rsvpClassess = {
  cardBody: {
    paddingTop: '24px',
    marginBottom: '24px',
    paddingBottom: '12px',
    minHeight: '80vh',
  },
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
    marginRight: '30px',
  },
  pageTitle: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '30px',
    alignItems: 'center',
  },
  cancelBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    background: RED_GRADIENT,
    color: 'white',
    width: '92px',
    height: '33px',
    marginRight: '30px',
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
    background: BLUE_GRDIENT,
    color: 'white',
    width: '92px',
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  action: {
    width: '150px',
    display: 'flex',
    justifyContent: 'start',
    zIndex: 900,
  },
  iconCursor: {
    width: '50px',
    cursor: 'pointer',
  },
}
