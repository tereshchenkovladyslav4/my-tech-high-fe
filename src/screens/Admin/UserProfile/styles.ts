export const useStyles = {
  content: {
    padding: '24px 32px',
    margin: 2,
    maxHeight: 'calc(100vh - 32px)',
    overflow: 'auto',
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
  select: {
    maxWidth: '150px',
    '&:before': {
      borderColor: '#fff',
    },
    '&:after': {
      borderColor: '#fff',
    },
  },
  checkBox: {
    fontSize: '12px',
    lineHeight: '22px',
    fontWeight: 600,
  },
  label: {
    fontSize: '14px',
    lineHeight: '22px',
    marginBottom: '8px',
    fontWeight: 600,
  },
  note: {
    fontSize: '22px',
    lineHeight: '22px',
    marginBottom: '8px',
    fontWeight: 600,
  },
  text: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    '& fieldset': {
      borderWidth: '1px !important',
      // borderColor: 'rgba(0, 0, 0, 0.23) !important',
    },
    '& input': {
      fontSize: '14px',
      lineHeight: '16px',
      padding: '16px',
      fontWeight: '700',
      color: 'black',
    },
    '& textarea': {
      fontSize: '14px',
      lineHeight: '16px',
      fontWeight: '700',
      color: 'black',
    },
  },
  dropdown: {
    '& .MuiFormControl-root .MuiOutlinedInput-root:not(.Mui-error):not(.Mui-disabled) fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderRadius: '8px',
    },
    '& .MuiInputBase-input': {
      color: 'black',
      fontSize: '14px',
      fontWeight: '700',
    },
  },
}
