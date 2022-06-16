import { SYSTEM_01, SYSTEM_08 } from '../../../../utils/constants'

export const useStyles = {
  cardBody: {
    paddingTop: '24px',
    marginBottom: '24px',
    paddingBottom: '12px',
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
  addButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '200px',
    height: '44px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
  },
  search: { width: '300px' },
  tableCell: {
    paddingLeft: 0,
    fontWeight: 700,
    borderBottom: '1px solid #E7E7E7',
    borderTop: '1px solid #E7E7E7',
  },
  pageTitle: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
  activeButton: {
    textTransform: 'none',
    borderRadius: 10,
    width: '160px',
    marginTop: 4,
    background: SYSTEM_01,
    '&:hover': {
      background: SYSTEM_01,
    },
  },
  inactiveButton: {
    textTransform: 'none',
    borderRadius: 10,
    width: '160px',
    marginTop: 4,
    background: SYSTEM_08,
    color: SYSTEM_01,
    '&:hover': {
      background: SYSTEM_08,
      color: SYSTEM_01,
    },
  },
  buttonGroup: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 4,
  },
}
