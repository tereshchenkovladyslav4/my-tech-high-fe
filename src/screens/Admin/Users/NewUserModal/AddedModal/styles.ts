import { BLACK, SYSTEM_08 } from '../../../../../utils/constants'

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
    pt: 1.4,
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  submitButton: {
    borderRadius: 10,
    width: '160px',
    '&:hover': {
      color: '#000',
    },
  },
  cancelButton: {
    borderRadius: 10,
    width: '160px',
    backgroundColor: SYSTEM_08,
  },
}
