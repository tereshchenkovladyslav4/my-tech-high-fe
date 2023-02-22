import { MthColor } from '@mth/enums'

export const useStyles = {
  baseSettings: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    px: 3,
    py: 4,
    margin: 3,
    background: MthColor.WHITE,
    minHeight: '100%',
    borderRadius: '4px',
    '& ul': {
      listStyle: 'none !important',
      marginLeft: '0 !important',
    },
    '& li': {
      listStyle: 'none !important',
      marginLeft: '0 !important',
    },
  },
  outlinedTextWrapper: {
    width: '200px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: MthColor.SYSTEM_13,
      borderRadius: '3px',
      color: MthColor.BLACK,
    },
    '& label': {
      color: MthColor.SYSTEM_01,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        border: `1px solid ${MthColor.SYSTEM_13} !important`,
      },
    },
  },
  dropdownWrapper: {
    width: '200px',
    textAlign: 'left',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${MthColor.MTHLIGHTGRAY} !important`,
    },
  },
}
