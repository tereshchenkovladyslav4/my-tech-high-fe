import { inputLabelClasses, outlinedInputClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const quickLinkCardClasses = {
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: '8px',
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
  dropdown: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: `${MthColor.SYSTEM_07}!important`,
      borderWidth: '2px',
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: `${MthColor.SYSTEM_07}!important`,
      borderWidth: '2px',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    ['& label']: {
      maxWidth: '95%',
      top: 'auto',
      bottom: '19px',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      color: `${MthColor.SYSTEM_07}!important`,
    },
  },
}
