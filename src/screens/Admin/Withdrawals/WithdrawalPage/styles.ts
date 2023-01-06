import { MthColor } from '@mth/enums'

export const mainClasses = {
  card: {
    paddingTop: '24px',
    marginBottom: '24px',
    paddingBottom: '12px',
  },
  select: {
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
  pageHeader: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageHeaderContent: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
  pageHeaderButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    marginRight: '24px',
  },
  emailButton: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    background: MthColor.RED_GRADIENT,
    color: 'white',
    width: '157px',
    marginRight: 2,
    height: '33px',
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  withdrawalButton: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: MthColor.YELLOW_GRADIENT,
    color: 'white',
    width: '195px',
    marginRight: 2,
    '&:hover': {
      background: '#FFD626',
      color: '#fff',
    },
  },
  reinstateButton: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: MthColor.GREEN_GRADIENT,
    color: 'white',
    width: '195px',
    '&:hover': {
      background: '#33FF7C',
      color: 'fff',
    },
  },
  quickWithdrawalButton: {
    borderRadius: 2,
    textTransform: 'none',
    height: 29,
    color: 'white',
    width: '150px',
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  container: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginY: 4,
    marginRight: '24px',
  },
  content: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'left',
  },
  buttonDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'left',
    justifyContent: 'flex-end',
    marginLeft: '24px',
  },

  modalCard: {
    position: 'absolute' as const,
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
    borderRadius: 2,
    color: 'white',
    cursor: 'pointer',
  },
  emailViewContent: {
    padding: '0 50px',
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
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 441,
    bgcolor: '#EEF4F8',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  },
  modalEmailViewCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  },
  emailRowHead: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  },
  subject: {
    marginTop: '30px',
    minHeight: '50px',
    border: '1px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '5px',
    padding: '12px 20px',
  },
  body: {
    border: '1px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '5px',
    minHeight: '360px',
    padding: '30px',
    marginBottom: '50px',
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    cursor: 'pointer',
  },
  emailLabel: {
    width: '135px',
    display: 'flex',
    alignItems: 'center',
  },
  emailViewLabel: {
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  ok: {
    borderRadius: 10,
    width: '9px',
    height: '19px',
    marginTop: 4,
  },
  selectIcon: {
    fill: '#F2F2F2',
    color: '#F2F2F2',
  },
  selectRoot: {
    color: '#F2F2F2',
  },
}
