import { MthColor } from '@mth/enums'

export const scheduleBuilderClasses = {
  main: {
    position: 'relative',
    width: '100%',
    '& .MuiSelect-select': {
      color: '#4145FF !important',
    },
    paddingLeft: 2,
  },
  customTable: {
    width: 'calc( 100% - 50px )',
    '& thead th': {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    '& tbody tr': {
      paddingBottom: '24px',
    },
    '& tbody tr td': {
      backgroundColor: '#FFFFFF !important',
      fontSize: '14px',
    },
    '& tbody tr td div': {
      borderLeft: 'none !important',
      fontSize: '14px',
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 'normal',
    },
  },
  tableContent: {
    fontSize: '14px',
  },

  questionButton: {
    width: 36,
    height: 36,
    borderRadius: 1000,
    backgroundColor: '#F2F2F2',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    fontWeight: 'bold',
    position: 'absolute',
    top: '0',
    right: '0',
  },
  labelColor: {
    color: '#4145FF !important',
  },
  nestedDropdownButton: {
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '4px 4px 4px 0px',
    '&:hover': { border: 'none', background: MthColor.WHITE },
  },
  descriptionWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    position: 'relative',
    bottom: '2px',
    width: '32px',
    height: '32px',
    marginY: 'auto',
  },
  editIcon: { fontSize: '22px', fontWeight: 700, color: MthColor.SYSTEM_06 },
}
