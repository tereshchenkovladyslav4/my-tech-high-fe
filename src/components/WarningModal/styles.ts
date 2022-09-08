import { makeStyles, Theme } from '@material-ui/core/styles'
import { BLACK } from '../../utils/constants'

export const useStyles = makeStyles((theme: Theme) => ({
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '470px',
    [theme.breakpoints.down('xs')]: {
      width: '97%',
    },
    height: 'max-content',
    minHeight: '275px',
    background: 'white',
    boxShadow: '24px',
    padding: '32px',
    borderRadius: '8px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    textTransform: 'capitalize',
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  errorOutline: {
    background: '#FAFAFA',
    borderRadius: '1px',
    color: BLACK,
    marginBottom: '20px',
    marginTop: '30px',
    height: '42px !important',
    width: '42px !important',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  button: {
    borderRadius: '40px !important',
    width: '200px',
    margin: '32px !important',
    marginBottom: '8px !important',
    background: '#E7E7E7',
    color: 'black',
    '&:hover': {
      color: '#fff',
    },
  },
  submit: {
    borderRadius: '40px !important',
    width: '200px',
    margin: '32px !important',
    marginBottom: '8px !important',
    background: 'black',
    '&:hover': {
      color: '#000',
    },
  },
}))
