import { BLACK } from '../../utils/constants'

export const useStyles = {
  modalCard: {
    position: 'absolute' as 'absolute',
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
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
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
    color: BLACK,
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
  button: {
    borderRadius: 10,
    width: '200px',
    margin: 4,
    background: '#E7E7E7',
    color: 'black',
    '&:hover': {
      color: '#fff',
    },
  },
  submit: {
    borderRadius: 10,
    width: '200px',
    margin: 4,
    background: 'black',
    '&:hover': {
      color: '#000',
    },
  },
}
