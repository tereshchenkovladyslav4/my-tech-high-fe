import { Theme, makeStyles } from '@material-ui/core/styles'
export const assignmentStyle = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '10px',
    '& .btn-action': {
      width: '100%',
      padding: '20px 55px',
    },
    '& .MuiPagination-root': {
      width: 'max-content',
    },
    [theme.breakpoints.up('sm')]: {
      '&': {
        gap: '20px',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      '& .btn-action': {
        width: '92px',
      },
    },
    [theme.breakpoints.up('md')]: {
      '&': {
        gap: '40px',
        flexWrap: 'nowrap',
      },
    },
    [theme.breakpoints.up('lg')]: {
      '&': {
        gap: '60px',
      },
    },
  },
}))
