export const announcementClasses = {
  card: {
    marginRight: 25,
    width: 400,
    borderRadius: 12,
  },
  closeIconContainer: {
    top: -30,
    right: -20,
  },
  closeIcon: {
    fontSize: 18,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 2,
  },
  announcementItem: {
    '&:hover': {
      background: '#F5F5F5',
      color: '#000',
    },
    paddingLeft: '20px',
    paddingRight: '40px',
    borderRadius: 2,
    cursor: 'pointer',
  },
  clearAll: {
    marginTop: 5,
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    width: '100%',
  },
  readMoreSection: { display: 'flex', padding: '10px 90px' },
}
