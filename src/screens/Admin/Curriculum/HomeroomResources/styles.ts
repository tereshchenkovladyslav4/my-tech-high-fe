import { MthColor } from '@mth/enums'

export const homeroomResourcesClasses = {
  yearSelect: {
    '& .MuiSvgIcon-root': {
      color: MthColor.MTHBLUE,
    },
    '& .MuiSelect-select': {
      fontSize: '20px',
      minHeight: '20px !important',
      padding: '6px 32px 6px 0 !important',
      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
  formError: {
    color: MthColor.RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: '4px',
  },
}
