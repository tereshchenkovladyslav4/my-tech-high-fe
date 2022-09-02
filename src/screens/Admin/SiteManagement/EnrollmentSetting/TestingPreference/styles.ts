import { MthColor } from '@mth/enums'

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
    marginRight: 4,
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
  addBtn: {
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: MthColor.BLUE_GRDIENT,
    color: 'white',
    width: '140px',
    marginLeft: 5,
    marginTop: 3,
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
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
}
