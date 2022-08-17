import { MthColor } from '@mth/enums'

export const documentUploadModalClasses = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 628,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  close: {
    background: '#A3A3A4',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
    fontSize: '10px',
    marginLeft: '12px',
  },
  uploadButton: {
    borderRadius: 5,
    width: '152px',
    marginTop: '14px',
    marginBottom: '14px',
  },
  finishButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  finishButton: {
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    borderRadius: 5,
    width: '152px',
    marginTop: '14px',
    marginBottom: '14px',
  },
  cancelButton: {
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    borderRadius: 5,
    width: '152px',
    marginTop: '14px',
    marginBottom: '14px',
  },
  dragAndDropText: {
    marginTop: '14px',
    marginBotton: '4px',
  },
  input: {
    display: 'none',
  },
  customFileUpload: {
    display: 'inline-block',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  text: {
    cursor: 'pointer',
  },
}
