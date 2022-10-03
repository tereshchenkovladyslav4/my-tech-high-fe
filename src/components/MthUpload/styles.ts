export const useStyles = {
  upload: {
    '.uploader-container': {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      gap: '10px',
    },
    '.uploaded-list': {
      minHeight: '60px',
    },
    '.k-upload': {
      width: '100%',
      position: 'relative',
      height: '100px',
      display: 'flex',
      justifyContent: 'center',
      background: '#08080802',
      '&:hover': {
        background: '#08080804',
      },
      '&.active': {
        border: '2px dashed black',
        background: '#08080815',
      },
      '.box__file': {
        width: '100%',
        height: '100%',
        zIndex: 2,
        position: 'absolute',
        opacity: 0,
        left: 0,
        top: 0,
      },
      '.k-upload-label': {
        marginTop: 'auto',
      },
    },
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    color: '#7B61FF',
    flexDirection: 'row',
    marginBottom: '0px',
    fontSize: '14px',
  },
}
