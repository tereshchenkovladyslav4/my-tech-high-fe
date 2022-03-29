export const useStyles = {
  root: {
    flexGrow: 1,
  },
  tabs: {
    '& .MuiButtonBase-root.MuiTab-root': {
      borderRadius: '25px',
      padding: 0,
    },
    '& .MuiTabs-indicator': {
      //backgroundColor: "orange"
      display: 'none',
      padding: 0,
    },
    '& .Mui-selected': {
      backgroundColor: 'black',
      color: 'white',
      padding: 0,
    },
  },
  tabTwo: {
    '&.MuiButtonBase-root.MuiTab-root': {
      borderRadius: '25px',
    },
  },
  tabThree: {
    '&.MuiButtonBase-root.MuiTab-root': {
      borderRadius: '25px',
    },
  },
}
