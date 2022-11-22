import { MthColor } from '@mth/enums'

export const studentInfoClass = {
  main: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '37px',
    paddingRight: '46px',
    paddingLeft: '30px',
    '& p': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },

  info: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 1,
    textAlign: 'left',
  },
  info_name: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 700,
  },
  info_box: {
    display: 'flex',
    justifyContent: 'start',
  },
  select: {
    fontSize: '12px',
    paddingTop: '2px',
    paddingBottom: '1px',
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    height: '35px',
    borderRadius: '8px',
    '& .MuiSelect-select': {
      color: 'white',
      fontWeight: 500,
      fontSize: '12px',
    },
    '& .MuiSvgIcon-root': {
      color: 'white !important',
    },
  },
}
