import { MthColor } from '@mth/enums'

export const useStyles = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 754,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    marginBottom: 1,
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
    marginTop: 4,
  },
}
