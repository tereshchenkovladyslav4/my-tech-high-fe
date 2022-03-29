import { SYSTEM_01, LIGHTGRAY, SECONDARY_MEDIUM_DEFAULT, SYSTEM_02, RED } from '../../../../utils/constants'

export const useStyles = {
  gridContainer: {
    textAlign: 'left' as const,
    paddingX: 4,
    paddingY: 2,
    marginTop: 2,
    marginBottom: 4
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
  textField: {
    borderRadius: 2,
    height: '45px',
  },
  button: {
    height: '45px',
    width: '100%',
    borderRadius: 2,
    backgroundColor: LIGHTGRAY,
    color: SYSTEM_01,
    '&:hover': {
      background: '#e6e6e6',
      color: '#000',
    },
  },
  resubmitButton: {
    background: RED,
    height: '45px',
    width: '100%',
    borderRadius: 2,
    '&:hover': {
      background: RED,
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
  semesterText:{
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '22px',
    lettersSpacing: '0px',
    textAlign: 'left',
    color: SYSTEM_02,
  },
}
