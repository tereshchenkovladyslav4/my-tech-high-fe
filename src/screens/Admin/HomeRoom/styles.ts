import { outlinedInputClasses, inputLabelClasses } from '@mui/material'
import { MthColor } from '@mth/enums'
import { BLACK, ERROR_RED } from '../../../utils/constants'

export const useStyles = {
  base: {
    position: 'relative',
    px: 3,
    py: 4,
    margin: 3,
    background: '#fff',
    minHeight: '100%',
    borderRadius: '4px',
  },
  filter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  filterButton: {
    padding: '8px 24px',
    borderRadius: '50px',
    fontSize: '11px',
    height: '31px',
  },
  addButton: {
    color: 'white',
    px: 4,
    borderRadius: 2,
  },
  baseSettings: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    px: 3,
    py: 4,
    margin: 3,
    background: '#fff',
    minHeight: '100%',
    borderRadius: '4px',
  },
  form: {
    '& .MuiInputBase-root': {
      height: '46px',
    },
    '& .Mui-error': {
      color: ERROR_RED,
    },
    '& .MuiFormControlLabel-root': {
      alignItems: 'flex-start',
      '.MuiFormControlLabel-label': {
        paddingTop: '8px',
      },
    },
  },
  cardBox: {
    '& .MuiCard-root': {
      marginLeft: '0 !important',
      marginRight: '0 !important',
    },
  },
  textLabel: {
    fontWeight: 600,
  },
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
    maxHeight: '97vh',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  textField: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: 'black !important',
      borderWidth: '1px !important',
    },
    width: '100%',
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    marginY: 2,
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
  },
  dropdown: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: BLACK,
      borderWidth: '2px',
      height: '46px',
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: BLACK,
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
    width: '100%',
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
    background: 'linear-gradient(90deg, #0E0E0E 0%, #666666 99.68%), #0E0E0E',
  },
  formError: {
    color: MthColor.ERROR_RED,
    fontSize: '12px',
    lineHeight: '20px',
    marginLeft: '12px',
    marginTop: '4px',
  },
  saveButtons: {
    borderRadius: 10,
    mr: '20px',
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    fontWeight: 'bold',
    paddingX: '40px !important',
    color: 'white',
  },
  searchList: {
    width: '100%',
    position: 'absolute',
    color: 'black',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: '4px',
    boxShadow: 24,
    zIndex: 100,
  },
}
