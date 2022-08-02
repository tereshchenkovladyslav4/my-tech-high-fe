import { makeStyles } from '@material-ui/core'
import { BUTTON_LINEAR_GRADIENT } from '../../../../../utils/constants'

export const useStyles = makeStyles({
  modalCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 828,
    backgroundColor: 'white',
    boxShadow: '24px',
    padding: '15px 15px 30px',
    borderRadius: '12px',
    maxHeight: '90%',
    overflow: 'auto',
  },
  editor: {
    border: '1px solid #d1d1d1',
    borderRadius: 1,
    marginBottom: '24px',
    '& div.DraftEditor-editorContainer': {
      minHeight: '200px',
      maxHeight: '250px',
      padding: '0 10px',
      '& .public-DraftEditor-content': {
        minHeight: '200px',
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
  subject: {
    marginTop: 2,
  },
  isActive: {
    color: 'black',
    marginRight: 2,
    cursor: 'pointer',
  },
  close: {
    background: 'black',
    borderRadius: 4,
    color: 'white',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  save: {
    borderRadius: 8,
    textTransform: 'none',
    height: 24,
    background: '#000 !important',
    color: 'white !important',
    marginRight: '12px !important',
    width: '92px',
  },
  add: {
    borderRadius: 8,
    textTransform: 'none',
    height: 40,
    background: BUTTON_LINEAR_GRADIENT,
    color: 'white',
    fontSize: 16,
  },
  'availbe-row': {
    display: 'flex',
    alignItems: 'center',
    '& .type-field': {
      minWidth: '150px',
      textTransform: 'uppercase',
    },
  },
  select: {
    width: '150px',
  },
  textarea: {
    width: '100%',
  },
})
