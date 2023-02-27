export const instructionEditModalClasses = {
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
}
