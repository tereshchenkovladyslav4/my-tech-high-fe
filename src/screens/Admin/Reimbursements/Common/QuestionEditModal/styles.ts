export const questionEditClasses = {
  modalContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '651px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90%',
    overflowY: 'scroll',
  },
  modalContent: {
    display: 'flex',
    marginTop: '10px',
    paddingBottom: '20px',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'auto',
  },
  btnGroup: {
    position: 'absolute',
    right: '50px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    button: {
      width: '100px',
    },
  },
}
