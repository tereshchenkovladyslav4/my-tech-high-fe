import { MthColor } from '@mth/enums'

export const homeroomResourcesCardClasses = {
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: '8px',
    cursor: 'pointer',
    '& svg': {
      fontSize: '26px',
    },
  },
  actionButton: {
    '& .MuiSvgIcon-root': {
      color: MthColor.SYSTEM_01,
    },
    '&.Mui-disabled': {
      '& .MuiSvgIcon-root': {
        color: '#A3A3A4',
      },
    },
  },
}
