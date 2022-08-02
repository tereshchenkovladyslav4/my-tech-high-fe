import { BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'

export const withdrawalModalClasses = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    paddingLeft: '18px',
    borderRadius: 2,
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  content: {
    marginTop: '10px',
    paddingBottom: '20px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100% - 60px)',
    overflow: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#ffffff',
    },

    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },

    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  avatar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'left',
  },
  studentImg: {
    height: '87px',
    width: '95px',
    marginRight: '12px',
    fontSize: '3rem',
  },
  reimbursementBtn: {
    background: BUTTON_LINEAR_GRADIENT,
    textTransform: 'none',
    color: 'white',
    marginRight: 2,
    width: '264px',
    height: '34px',
    borderRadius: 2,
  },
  cancelBtn: {
    width: '200px',
    height: '48px',
    fontSize: '12px',
    background: '#E7E7E7',
    borderRadius: '50px',
  },
  emailBtn: {
    width: '200px',
    height: '48px',
    background: BUTTON_LINEAR_GRADIENT,
    borderRadius: '50px',
    fontSize: '12px',
    color: 'white',
  },
  withdrawBtn: {
    width: '200px',
    height: '48px',
    background: '#000000',
    borderRadius: '50px',
    fontSize: '12px',
    color: 'white',
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '60px',
    gap: '20px',
  },
}
