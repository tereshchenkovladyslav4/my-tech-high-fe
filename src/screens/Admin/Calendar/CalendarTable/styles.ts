import { BLACK, SYSTEM_01, SYSTEM_04, SYSTEM_06, SYSTEM_08 } from '../../../../utils/constants'

export const useStyles = {
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
    justifyContent: 'flex-end',
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
  clubButton: {
    mt: 1.5,
    background: '#2b9db72b',
    width: 72,
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
    marginRight: 4,
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
