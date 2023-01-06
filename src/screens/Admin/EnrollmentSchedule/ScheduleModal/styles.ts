import { outlinedInputClasses, inputLabelClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const useStyles = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 828,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflowY: 'auto',
    maxHeight: '97vh',
  },
  editor: {
    border: '1px solid #d1d1d1',
    borderRadius: 1,
    marginBottom: '24px',
    'div.DraftEditor-editorContainer': {
      minHeight: '200px',
      maxHeight: '250px',
      overflow: 'scroll',
      padding: 1,
      '.public-DraftStyleDefault-block': {
        margin: 0,
      },
    },
  },
  toolBar: {
    borderBottom: '1px solid #d1d1d1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  cancelButton: {
    borderRadius: 10,
    background: '#E7E7E7',
    width: '200px',
    marginRight: 1,
  },
  submitButton: {
    borderRadius: 10,
    width: '200px',
    marginLeft: 1,
  },
  icon: {
    marginRight: 2,
    color: '#e7e7e7',
    cursor: 'pointer',
  },
  from: {
    marginTop: 2,
  },
  subject: {
    marginTop: 0,
  },
  isActive: {
    color: 'black',
  },
  'ul.primary-bullet': {
    listStyleType: 'lower-roman',
  },
  'ul.sub-bullet': {
    listStyleType: 'square',
    marginLeft: '-2em',
  },
  dropdown: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
      borderWidth: '2px',
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
      borderWidth: '2px',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    marginTop: '40px',
    marginBottom: '50px',
    width: '100%',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  textFieldError: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: '#BD0043',
    },
    marginY: 2,
    width: '100%',
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    marginTop: '40px',
    marginBottom: '50px',
  },

  modalEmailCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 441,
    bgcolor: '#EEF4F8',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  },
  close: {
    background: 'black',
    borderRadius: 2,
    color: 'white',
    cursor: 'pointer',
  },
  modalHistoryContent: {
    padding: '15px',
  },
  emailRowHead: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  },
  emailLabel: {
    width: '135px',
    display: 'flex',
    alignItems: 'center',
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    cursor: 'pointer',
  },
  modalEmailViewCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  },
  emailViewContent: {
    padding: '0 50px',
  },
  historySubject: {
    marginTop: '30px',
    minHeight: '50px',
    border: '1px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '5px',
    padding: '12px 20px',
  },
  body: {
    border: '1px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '5px',
    minHeight: '360px',
    padding: '30px',
    marginBottom: '50px',
  },
  redBorder: {
    border: '1px solid red',
    borderRadius: '4px',
    marginBottom: '24px',
  },
}
