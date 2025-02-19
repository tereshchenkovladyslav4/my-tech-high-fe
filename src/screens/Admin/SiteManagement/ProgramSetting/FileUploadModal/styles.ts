import { MthColor } from '@mth/enums'

export const fileUploadModalClassess = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 628,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  delete: {
    cursor: 'pointer',
    color: 'black',
    marginTop: '-5px',
    marginLeft: '10px',
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
    background: MthColor.SYSTEM_08,
    borderRadius: 5,
    color: MthColor.BLACK,
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
  fileListItem: {
    display: 'flex',
    flexDirection: 'row',
    color: '#7B61FF',
    marginTop: '6px',
  },
}
