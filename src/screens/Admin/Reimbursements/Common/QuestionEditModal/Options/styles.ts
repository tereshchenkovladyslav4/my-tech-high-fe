import { MthColor } from '@mth/enums'

export const optionClasses = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottom: `2px solid ${MthColor.SYSTEM_07}`,
    display: 'flex',
    width: '100%',
  },
  item: {
    display: 'flex',
    py: '10px',
    alignItems: 'center',
    width: '50%',
  },
  textField: {
    flex: 1,
    p: '5px',
    pl: '10px',
    '& .MuiInput-underline:after': {
      borderWidth: '0px',
      borderColor: 'transparent',
    },
    '& .MuiInput-underline:before': {
      borderWidth: '0px',
      borderColor: 'transparent',
    },
    '& .MuiInput-root:hover:not(.Mui-disabled):before': {
      borderWidth: '0px',
      borderColor: 'transparent',
    },
    '& :hover': {
      borderWidth: '0px',
      borderColor: 'transparent',
    },
  },
  deleteBtn: {
    color: '#fff',
    bgcolor: '#000',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
}
