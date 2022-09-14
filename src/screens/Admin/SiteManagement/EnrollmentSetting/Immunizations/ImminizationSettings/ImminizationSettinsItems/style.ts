import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(() => ({
  formRoot: {
    marginLeft: '25px !important',
    marginTop: '-15px !important',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },
  selectRoot: {
    '& .MuiInputBase-input': {
      padding: '0px !important',
    },
    color: '#4145FF',
  },
  selectPaper: {
    color: '#4145FF',
    textAlign: 'start',
  },
  icon: {
    color: 'black',
    fontSize: '13px',
  },
}))
