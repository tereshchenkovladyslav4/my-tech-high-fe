export const studentFilesModalClassess = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    marginBottom: 1,
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  addButton: {
    background: '#FAFAFA',
    color: 'black',
    width: '100px',
    alignItems: 'center',
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
  },
}
