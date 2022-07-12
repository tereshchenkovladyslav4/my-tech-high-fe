import { BLUE_GRDIENT } from '../../../../utils/constants'

export const mainClasses = {
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
  editButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '200px',
    height: '44px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginRight: 4,
  },
  addButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '200px',
    height: '44px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginRight: 4,
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
    marginRight: 6,
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  clubButton: {
    background: '#2b9db72b',
    width: 'auto',
    marginRight: 1
  },
  iconButton: {
    background: 'transparent',
    minWidth: 'fit-content',
    padding: .75
  },
  arrowIconButton: {
    minWidth: 'fit-content',
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
    minWidth: 'fit-content',
    padding: 1,
    marginRight: 1,
  },
  leftArrowButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '45px',
    height: '45px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    minWidth: 'fit-content',
    marginRight: 4,
  },
  rightArrowButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '45px',
    height: '45px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    marginLeft: 4,
  },
  search: { width: '300px' },
  pageTitle: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
}
