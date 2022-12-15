export const addNewQuestionClasses = {
  modalContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
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
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    button: {
      width: '100px',
    },
  },
}
