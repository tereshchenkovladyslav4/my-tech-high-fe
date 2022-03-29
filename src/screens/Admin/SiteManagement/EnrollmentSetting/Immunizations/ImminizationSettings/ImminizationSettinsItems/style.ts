import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(() => ({
  formRoot: {
    marginLeft: '25px',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },
  selectRoot: {
    '& .MuiInputBase-input': {
      padding: 0,
    },
    color: '#4145FF',
  },
  selectPaper: {
    color: '#4145FF',
  },
  icon: {
    color: 'black',
    fontSize: '13px',
  },
}))
