import { BUTTON_LINEAR_GRADIENT, BLACK } from '../../../../utils/constants'

export const useStyles = {
  modalCard: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 850,
    bgcolor: '#EEF4F8',
    boxShadow: 24,
    padding: '16px 32px',
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '200px',
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
    padding: '10px 0',
  },
  submitButton: {
    borderRadius: '8px',
    width: '90px',
    '&:hover': {
      backgroundColor: '#313131',
    },
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    height: '39px',
    '&:nth-child(even)': {
      background: '#fff',
      borderRadius: '8px',
    },
  },
  formLabel: {
    width: '155px',
    textAlign: 'center',
    position: 'relative',
    color: '#000000',
  },
  formValue: {
    padding: '0 30px',
    color: '#7b61ff',
    position: 'relative',
  },
  labelAfter: {
    width: 0,
    height: '23px',
    borderRight: '1px solid #000000',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  modalEmailCard: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 441,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  emailRowHead: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
  },
  emailLabel: {
    width: '150px',
    display: 'flex',
    alignItems: 'center',
  },
  ok: {
    borderRadius: 10,
    width: '9px',
    height: '19px',
    marginTop: 4,
  },
  select: {
    borderRadius: '15px',
    width: '135px',
    height: '29px',
    textAlign: 'center',
    background: BUTTON_LINEAR_GRADIENT,
    color: '#F2F2F2',
    '&:before': {
      borderColor: BUTTON_LINEAR_GRADIENT,
    },
    '&:after': {
      borderColor: BUTTON_LINEAR_GRADIENT,
    },
  },
  selectIcon: {
    fill: '#F2F2F2',
    color: '#F2F2F2',
  },
  selectRoot: {
    color: '#F2F2F2',
  },
}
