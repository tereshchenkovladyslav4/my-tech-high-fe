import { MthColor } from '@mth/enums'

export const courseCatalogHeaderClasses = {
  iconButton: {
    position: 'relative',
    bottom: '2px',
  },
  arrowIcon: {
    fontSize: '18px',
    fill: 'black',
    stroke: 'black',
    strokeWidth: 1,
  },
  toggleButtonGroup: {
    '& .MuiToggleButton-root': {
      padding: '8px 24px',
      fontWeight: '500',
      fontSize: '11px',
      lineHeight: '20px',
      color: MthColor.BLACK,
      background: MthColor.LIGHTGRAY,
      borderColor: MthColor.LIGHTGRAY,
      borderRadius: '60px !important',
      '&.Mui-selected': {
        fontWeight: '600',
        color: MthColor.WHITE,
        background: MthColor.BLACK,
        borderColor: MthColor.BLACK,
        '&:hover': {
          background: MthColor.BLACK,
        },
      },
    },
  },
}
