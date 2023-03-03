import { MthColor } from '@mth/enums'

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
    '& ul, ol': {
      listStyle: 'none !important',
      marginLeft: '0 !important',
    },
    '& li': {
      listStyle: 'none !important',
      '&::before, &::marker': {
        display: 'none !important',
        content: '""',
      },
    },
  },
  form: {
    '& .MuiInputBase-root': {
      height: '46px',
    },
    '& .Mui-error': {
      color: MthColor.RED,
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
}
