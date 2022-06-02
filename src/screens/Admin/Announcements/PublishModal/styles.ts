import { BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'

export const useStyles = {
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '660px',
    height: 'auto',
    bgcolor: '#EEF4F8',
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    p: 4,
  },
  modalBody: {
    textAlign: 'center',
  },
  modalIcon: {
    fontSize: 50,
    margin: '20px 0px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
    gap: '20px',
  },
  cancelBtn: {
    width: '160px',
    height: '36px',
    background: '#E7E7E7',
    borderRadius: '50px',
    marginRight: '50px',
  },
  publishBtn: {
    width: '160px',
    height: '36px',
    background: '#43484F',
    borderRadius: '50px',
    color: 'white',
  },
  scheduleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '50px',
  },
  scheduleSendBtn: {
    width: '160px',
    height: '36px',
    borderRadius: '50px',
    color: 'white',
    textTransform: 'none',
    background: BUTTON_LINEAR_GRADIENT,
    marginRight: 2,
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
}
