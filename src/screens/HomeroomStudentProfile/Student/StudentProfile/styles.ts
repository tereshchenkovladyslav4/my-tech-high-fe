import { MthColor } from '@mth/enums'

export const studentProfileClasses = {
  gridContainer: {
    display: { xs: 'none', sm: 'block' },
    textAlign: 'left' as const,
    paddingX: 4,
    paddingY: 2,
    marginTop: 2,
    marginBottom: 4,
  },
  mobileGridContainer: {
    display: { xs: 'block', sm: 'none' },
  },
  avatar: {
    height: '164px',
    width: '164px',
  },
  buttonContainer: {
    borderRadius: 8,
    paddingX: 5,
    paddingY: 1.5,
  },
  formField: {
    borderRadius: 2,
    '& .MuiInputBase-input.MuiOutlinedInput-input ': {
      paddingY: '11px',
      borderRadius: 2,
    },
  },
  button: {
    height: '45px',
    width: '100%',
    borderRadius: 2,
    backgroundColor: MthColor.LIGHTGRAY,
    color: MthColor.SYSTEM_01,
    '&:hover': {
      background: '#e6e6e6',
      color: '#000',
    },
  },
  resubmitButton: {
    background: MthColor.RED,
    height: '45px',
    width: '100%',
    borderRadius: 2,
    '&:hover': {
      background: MthColor.RED,
    },
  },
  enrollmentButton: {
    height: '45px',
    width: '100%',
    borderRadius: 2,
    '&:hover': {
      background: '#292626',
    },
  },
  semesterText: {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '22px',
    lettersSpacing: '0px',
    textAlign: 'left',
    color: MthColor.SYSTEM_02,
  },
  pendingBtn: {
    height: '45px',
    width: '100%',
    borderRadius: 2,
    background: '#2B9EB7',
    '&:hover': {
      background: '#2B9EB7',
    },
  },
}
