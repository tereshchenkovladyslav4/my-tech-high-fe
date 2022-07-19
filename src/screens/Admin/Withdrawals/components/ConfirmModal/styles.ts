export const modalClassess = {
  body: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '550px',
    height: 'auto',
    bgcolor: '#FFFFFF',
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    p: 4,
  },
  cancelBtn: { width: '160px', height: '36px', background: '#E7E7E7', borderRadius: '50px' },
  confirmBtn: {
    width: '160px',
    height: '36px',
    background: '#000000',
    borderRadius: '50px',
    color: 'white',
  },
  btnGroup: { display: 'flex', justifyContent: 'space-evenly', marginTop: '30px', gap: '20px' },
}
