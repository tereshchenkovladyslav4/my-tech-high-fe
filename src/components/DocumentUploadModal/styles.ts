import { MthColor } from '@mth/enums'

export const documentUploadModalClasses = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 628,
    backgroundColor: 'background.paper',
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
  delete: {
    cursor: 'pointer',
    color: MthColor.SYSTEM_02,
    fontSize: '20px',
    marginTop: '-5px',
    marginLeft: '10px',
  },
  closeBtn: {
    background: 'black',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
  },
  dragAndDropText: {
    marginTop: '14px',
    marginBottom: '4px',
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
