import { MthColor } from '@mth/enums'

const button = {
  position: 'absolute',
  top: 15,
  right: 77,
  width: 123,
  height: 44,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  '&:hover': {
    color: 'white',
  },
}

export const resourceCardClasses = {
  card: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 2,
    margin: 1,
    minWidth: 300,
  },
  button,
  blackButton: {
    ...button,
    background: MthColor.BLACK,
    '&:hover': {
      background: MthColor.BLACK,
    },
  },
  primaryButton: {
    ...button,
    background: MthColor.MTHBLUE,
    '&:hover': {
      background: MthColor.MTHBLUE,
    },
  },
  purpleButton: {
    ...button,
    background: MthColor.LIGHTPURPLE,
    '&:hover': {
      background: MthColor.LIGHTPURPLE,
    },
  },
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
}
