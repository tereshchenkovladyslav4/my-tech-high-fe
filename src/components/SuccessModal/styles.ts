import { makeStyles, Theme } from '@material-ui/core/styles'
import { MthColor } from '@mth/enums'

export const useClasses = makeStyles((theme: Theme) => ({
  modalCard: {
    width: '441px',
    [theme.breakpoints.down('xs')]: {
      width: '97% !important',
    },
  },
}))

export const useStyles = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 441,
    height: 275,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  errorOutline: {
    background: '#FAFAFA',
    borderRadius: 1,
    color: MthColor.BLACK,
    marginBottom: 12,
    height: 42,
    width: 42,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  submitButton: {
    borderRadius: 10,
    width: '200px',
    background: MthColor.BLACK_GRADIENT,
    marginTop: 4,
    '&:hover': {
      color: MthColor.BLACK,
    },
  },
}
