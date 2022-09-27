import { BUTTON_LINEAR_GRADIENT, ERROR_RED } from '../../../utils/constants'

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
    width: '160px',
    borderRadius: '50px',
  },
  addButton: {
    background: BUTTON_LINEAR_GRADIENT,
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
      'align-items': 'flex-start',
      '.MuiFormControlLabel-label': {
        paddingTop: '8px',
      },
    },
  },
}
