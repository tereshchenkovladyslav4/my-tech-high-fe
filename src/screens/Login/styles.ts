import { makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => ({
  mainContent: {
    [theme.breakpoints.down('xs')]: {
      padding: '8px',
    },
    position: 'relative',
    padding: '48px 93px',
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
    marginTop: '-200px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '40px',
    },
  },
}))
