export const scheduleBuilderClassess = {
  main: {
    width: '100%',
    '& .MuiSelect-select': {
      color: '#4145FF !important',
    },
    display: 'flex',
    paddingLeft: 2,
  },
  customTable: {
    width: 'calc( 100% - 50px )',
    '& thead th': {
      fontWeight: 'bold',
      fontSize: '16px',
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
    '& svg': {
      color: '#4145FF !important',
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
  },
  labelColor: {
    color: '#4145FF !important',
  },
  selectStyle: {
    borderBottom: 'none',
  },
}
