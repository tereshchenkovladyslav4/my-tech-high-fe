import { MthColor } from '@mth/enums'

const mthButtonCommonStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}

export const mthButtonSizeClasses = {
  xs: {
    ...mthButtonCommonStyles,
    height: '29px',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 16px',
  },
  small: {
    ...mthButtonCommonStyles,
    height: '36px',
    fontSize: '12px',
    fontWeight: '700',
    padding: '11px 16px',
  },
  medium: {
    ...mthButtonCommonStyles,
    height: '48px',
    fontSize: '12px',
    fontWeight: '700',
    padding: '11px 16px',
  },
}

export const mthButtonColorClasses = {
  primary: {
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF',
    color: MthColor.WHITE,
    '&:hover': {
      background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
      color: MthColor.WHITE,
    },
  },
  dark: {
    background: 'linear-gradient(90deg, #0E0E0E 0%, #666666 99.68%), #0E0E0E',
    color: MthColor.WHITE,
    '&:hover': {
      background: '#0E0E0E',
      color: MthColor.WHITE,
    },
  },
  gray: {
    background: MthColor.LIGHTGRAY,
    color: MthColor.SYSTEM_01,
    '&:hover': {
      background: MthColor.LIGHTGRAY,
      color: MthColor.SYSTEM_01,
    },
  },
  darkGray: {
    background: MthColor.SYSTEM_08,
    color: MthColor.SYSTEM_01,
    '&:hover': {
      background: MthColor.SYSTEM_08,
      color: MthColor.SYSTEM_01,
    },
  },
  orange: {
    background: 'linear-gradient(90deg, #8E2C09 0%, rgba(168, 72, 38, 0) 100%), #EC5925',
    color: MthColor.WHITE,
    '&:hover': {
      background: '#EC5925',
      color: MthColor.WHITE,
    },
  },
  red: {
    background: 'linear-gradient(90deg, #730D07 0%, rgba(117, 13, 7, 0) 100%), #D23C33',
    color: MthColor.WHITE,
    '&:hover': {
      background: '#D23C33',
      color: MthColor.WHITE,
    },
  },
  green: {
    background: 'linear-gradient(90deg, #17490F 0%, rgba(23, 73, 15, 0) 100%), #38892B',
    color: MthColor.WHITE,
    '&:hover': {
      background: MthColor.GREEN,
      color: MthColor.WHITE,
    },
  },
  black: {
    background: MthColor.SYSTEM_01,
    color: MthColor.WHITE,
    '&:hover': {
      background: MthColor.SYSTEM_01,
      color: MthColor.WHITE,
    },
  },
}

export const mthButtonClasses = {
  // Primary buttons
  primary: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.primary,
    borderRadius: '8px',
    minWidth: '140px',
  },
  roundPrimary: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.primary,
    borderRadius: '40px',
  },
  smallPrimary: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.primary,
  },
  xsPrimary: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.primary,
    borderRadius: '8px',
    minWidth: '92px',
  },
  roundSmallPrimary: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.primary,
    borderRadius: '40px',
    minWidth: '100px',
  },
  roundXsPrimary: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.primary,
    borderRadius: '40px',
    minWidth: '92px',
  },

  // Dark gradient buttons
  dark: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.dark,
    borderRadius: '8px',
    minWidth: '140px',
  },
  roundDark: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.dark,
    borderRadius: '40px',
  },
  smallDark: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.dark,
  },
  roundSmallDark: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.dark,
    borderRadius: '40px',
  },
  roundXsDark: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.dark,
    borderRadius: '40px',
    minWidth: '92px',
  },

  // Gray buttons
  gray: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.gray,
    borderRadius: '8px',
    minWidth: '140px',
  },
  roundGray: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.gray,
    borderRadius: '40px',
  },
  smallGray: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.gray,
  },
  roundSmallGray: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.gray,
    borderRadius: '40px',
  },
  roundXsGray: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.gray,
    borderRadius: '40px',
    minWidth: '92px',
  },

  // Dark gray buttons
  darkGray: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.darkGray,
    borderRadius: '8px',
    minWidth: '140px',
  },

  // Orange buttons
  orange: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.orange,
    borderRadius: '8px',
    minWidth: '140px',
  },
  roundOrange: {
    ...mthButtonSizeClasses.medium,
    ...mthButtonColorClasses.orange,
    borderRadius: '40px',
  },
  smallOrange: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.orange,
  },
  roundSmallOrange: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.orange,
    borderRadius: '40px',
  },

  // Red buttons
  xsRed: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.red,
    borderRadius: '8px',
    minWidth: '92px',
  },
  roundXsRed: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.red,
    borderRadius: '40px',
    minWidth: '92px',
  },

  // Green buttons
  roundXsGreen: {
    ...mthButtonSizeClasses.xs,
    ...mthButtonColorClasses.green,
    borderRadius: '40px',
    minWidth: '92px',
  },

  // Black buttons
  roundSmallBlack: {
    ...mthButtonSizeClasses.small,
    ...mthButtonColorClasses.black,
    borderRadius: '40px',
    minWidth: '92px',
  },
}
