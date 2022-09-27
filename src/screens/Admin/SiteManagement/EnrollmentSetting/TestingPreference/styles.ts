import { MthColor } from '@mth/enums'
import { ERROR_RED } from '../../../../../utils/constants'

export const testingPreferenceClassess = {
  container: {
    width: '95%',
    marginX: 'auto',
    marginY: '13px',
    bgcolor: 'white',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'start',
    paddingY: '30px',
  },
  buttonGroup: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '40px',
  },
  activeButton: {
    textTransform: 'none',
    borderRadius: 10,
    width: '160px',
    marginTop: 4,
    background: MthColor.SYSTEM_01,
    '&:hover': {
      background: MthColor.SYSTEM_01,
    },
  },
  inactiveButton: {
    textTransform: 'none',
    borderRadius: 10,
    width: '160px',
    marginTop: 4,
    background: MthColor.SYSTEM_08,
    color: MthColor.SYSTEM_01,
    '&:hover': {
      background: MthColor.SYSTEM_08,
      color: MthColor.SYSTEM_01,
    },
  },
  formError: {
    color: ERROR_RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: '4px',
    paddingLeft: 1,
  },
  addBtn: {
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF',
    color: 'white',
    width: '210px',
    marginLeft: '40px',
    marginTop: '40px',
    '&:hover': {
      backgroundColor: '#4145FF',
    },
    borderRadius: '8px',
  },
  action: {
    width: '100%',
    display: 'flex',
    justifyContent: 'end',
    zIndex: 900,
  },
  tableCotainer: {
    display: 'flex',
    padding: '10px',
  },
  iconCursor: {
    width: '50px',
    cursor: 'pointer',
  },
  verticalLine: {
    borderLeft: '1px solid #000',
    minHeight: '20px',
  },
  customizeModalContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    paddingLeft: '18px',
    borderRadius: 2,
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
  btnGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '60px',
    gap: '20px',
  },
  cancelBtn: {
    width: '200px',
    height: '48px',
    fontSize: '12px',
    background: '#E7E7E7',
    borderRadius: '50px',
  },
  saveBtn: {
    width: '200px',
    height: '48px',
    background: '#000000',
    borderRadius: '50px',
    fontSize: '12px',
    color: 'white',
  },
}
