import { outlinedInputClasses } from '@mui/material'
import { BLUE_GRDIENT, RED_GRADIENT, SYSTEM_07 } from '../../../../utils/constants'

export const useStyles = {
  cardBody: {
    paddingTop: '24px',
    marginBottom: '24px',
    paddingBottom: '12px',
    minHeight: '80vh',
  },
  pageTop: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTopRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '24px',
  },
  pageTitle: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
  tableCotainer: {
    display: 'flex',
    padding: '10px',
    borderBottom: '1px solid #E7E7E7',
  },
  circleBox: {
    width: 'calc(65% - 250px)',
  },
  circle: {
    borderRadius: 50,
    width: '15px',
    height: '15px',
    marginTop: '5px',
  },
  typeName: {
    width: '35%',
  },
  action: {
    width: '150px',
    display: 'flex',
    justifyContent: 'start',
    zIndex: 900,
  },
  color: {
    width: '100px',
    textAlign: 'left',
  },
  eventTypeBody: {
    width: '480px',
    display: 'grid',
    textAlign: 'left',
  },
  textfield: {
    color: 'green',
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07,
      borderWidth: '1px',
    },
    marginTop: 2,
    marginBottom: 1,
    width: '100%',
  },
  cancelBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    background: RED_GRADIENT,
    color: 'white',
    width: '92px',
    height: '33px',
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  saveBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: BLUE_GRDIENT,
    color: 'white',
    width: '92px',
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  iconCursor: {
    width: '50px',
    cursor: 'pointer',
  },
  posi_rela: {
    position: 'relative',
  },
}
