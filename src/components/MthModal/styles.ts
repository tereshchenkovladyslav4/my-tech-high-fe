import { MthColor } from '@mth/enums'

export const useStyles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 'auto',
    borderRadius: 4,
    backgroundColor: 'white',
    p: 4,
    overflow: 'auto',
    maxHeight: 'calc(100vh - 20px)',
    '& .modal-btn-close': {
      position: 'absolute',
      right: 26,
      top: 16,
      minWidth: 32,
      width: 32,
      height: 32,
      backgroundColor: MthColor.SYSTEM_01,
      color: 'white',
      padding: 0,
    },
  },
  button: {
    width: '160px',
  },
}
