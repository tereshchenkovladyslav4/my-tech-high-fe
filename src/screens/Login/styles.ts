import { makeStyles, Theme } from '@material-ui/core/styles'
import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'

export const useStyles = makeStyles((theme: Theme) => ({
  mainContent: {
    [theme.breakpoints.down('xs')]: {
      padding: '16px',
    },
    position: 'relative',
    padding: '48px 93px',
  },
  signInContent: {
    background: BUTTON_LINEAR_GRADIENT,
    padding: '48px',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  launchpadContent: {
    background: 'white',
    padding: '48px',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  singInButtonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    },
  },
  signInButton: {
    height: '53px',
    width: '106px',
    top: '15px',
    borderRadius: '33px!important',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
  },
  canvasButton: {
    marginTop: -1.2,
    height: '53px',
    width: '106px',
    top: '15px',
    borderRadius: '33px!important',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
  },
  passwordContainer: {
    width: '100%',
  },
  forgotPassword: {
    cursor: 'pointer',
    color: 'white',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '29px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  launchSignInBox: {
    marginTop: '-146px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0px',
    },
  },
  launchpadDesc: {
    marginTop: '-208px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '40px',
    },
  },
  mainHeader: {
    fontSize: '58px!important',
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: '40px!important',
    },
  },
  subHeader: {
    fontSize: '17px!important',
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px!important',
    },
  },
}))
