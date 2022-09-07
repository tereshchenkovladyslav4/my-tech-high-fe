import { BLUE_GRDIENT } from '../../../utils/constants'

export const parentCalendarClasses = {
  backButtonContainer: {
    backgroundColor: '#FAFAFA',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 3,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
  },
  divider: {
    marginLeft: 12,
    marginRight: 12,
    alignSelf: 'center',
  },
  cardBody: {
    paddingTop: '24px',
    marginBottom: '24px',
    paddingBottom: '12px',
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
    justifyContent: 'space-between',
    marginRight: '24px',
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
    background: BLUE_GRDIENT,
    color: 'white',
    width: '140px',
    minWidth: '140px',
    marginRight: 4,
    flex: 'auto',
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  clubButton: {
    background: '#2b9db72b',
    marginY: 'auto',
    width: 'auto',
  },
  arrowButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '45px',
    height: '45px',
    minWidth: 'fit-content',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginRight: 1,
  },
  leftArrowButton: {
    background: '#323232',
    color: 'black',
    width: '45px',
    height: '45px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginRight: '4px',
  },
  rightArrowButton: {
    background: '#323232',
    color: 'black',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginLeft: 4,
  },

  readMore: {
    color: '#4145FF',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'underline',
    paddingLeft: '5px',
  },
}
