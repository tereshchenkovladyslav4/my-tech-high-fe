import { makeStyles, Theme } from '@material-ui/core/styles'

export const useClasses = makeStyles((theme: Theme) => ({
  mainContent: {
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start !important',
    },
  },
  mainHeader: {
    fontSize: '58px !important',
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
      fontSize: '38px !important',
    },
  },
  descriptionContent: {
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  formContent: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  forgotPasswordText: {
    [theme.breakpoints.down('xs')]: {
      width: '100% !important',
    },
  },
}))

export const forgotPasswordClasses = {
  textField: {
    height: '45px',
    marginY: 2,
    width: '451.53px',
    marginBottom: 4,
    '& .MuiFormHelperText-root Mui-error': {
      color: 'white',
    },
  },
  button: {
    marginTop: 3,
    height: '53px',
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: '33.33440017700195px',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
  },
}
