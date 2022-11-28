import { MthColor } from '@mth/enums'

export const FileUploadModalClasses = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 628,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
  },
  close: {
    padding: 0,
    minWidth: '30px',
  },
  uploadButton: {
    borderRadius: 5,
    width: '152px',
    marginTop: '5px',
    marginBottom: '14px',
    padding: '12px',
    fontSize: '10px',
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
    width: '152px',
    marginTop: '14px',
    marginBottom: '14px',
    marginRight: { xs: '2px', sm: '0px' },
    color: MthColor.SYSTEM_01,
    fontWeight: 700,
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
  deleteIcon: {
    padding: 0,
    minWidth: '30px',
  },
}
