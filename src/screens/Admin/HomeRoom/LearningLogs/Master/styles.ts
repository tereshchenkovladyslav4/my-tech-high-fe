export const masterUseStyles = {
  formError: {
    color: '#BD0043',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: '4px',
    marginLeft: '20px',
  },
  modalRoot: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '50px',
    borderRadius: 2,
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '60px',
    gap: '20px',
  },
}
