import { outlinedInputClasses } from '@mui/material'
export const useStyles = {
  appBar: {
    backgroundColor: 'white',
    height: 83,
    paddingX: 5,
  },
  toolbar: {
    width: 'calc(100% - 260px)',
    maxWidth: 'calc(100% - 260px)',
    marginTop: 10,
  },

  divider: {
    height: '75%',
    alignSelf: 'center',
    zIndex: 100,
    borderWidth: '2px',
  },
  icon: {
    color: 'black',
    marginRight: 24,
  },
  searchList: {
    width: '100%',
    position: 'absolute',
    color: 'black',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: '4px',
    boxShadow: 24,
    zIndex: 100,
  },
}
