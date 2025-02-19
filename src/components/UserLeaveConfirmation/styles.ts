import { MthColor } from '@mth/enums'

export const useStyles = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 441,
    width: '95%',
    height: 295,
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
    textTransform: 'none',
    borderRadius: 10,
    width: '160px',
    marginLeft: 1,
    marginTop: 4,
    background: MthColor.SYSTEM_01,
    '&:hover': {
      background: MthColor.SYSTEM_01,
    },
  },
  cancelButton: {
    textTransform: 'none',
    borderRadius: 10,
    width: '160px',
    marginTop: 4,
    marginRight: 1,
    background: MthColor.SYSTEM_08,
    color: MthColor.SYSTEM_01,
    '&:hover': {
      background: MthColor.SYSTEM_08,
      color: MthColor.SYSTEM_01,
    },
  },
}
