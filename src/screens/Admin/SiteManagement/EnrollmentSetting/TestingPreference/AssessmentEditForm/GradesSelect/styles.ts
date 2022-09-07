import { MthColor } from '@mth/enums'

export const gradeSelectClassess = {
  gradeBox: {
    '& > :not(style)': { m: 1 },
  },
  gradesDialog: {
    marginX: 'auto',
    paddingY: '10px',
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  dialogTitle: {
    fontWeight: 'bold',
    marginTop: '10px',
    textAlign: 'left',
  },
  formGroup: {
    marginLeft: '24px',
    marginRight: '150px',
    marginBottom: '40px',
  },
  dialogAction: {
    justifyContent: 'center',
    marginBottom: 2,
  },
  cancelButton: {
    borderRadius: 2,
    textTransform: 'none',
    height: 29,
    color: 'white',
    width: '92px',
    background: MthColor.RED_GRADIENT,
    marginRight: 3,
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  submitButton: {
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    color: 'white',
    width: '92px',
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 700,
    height: 29,
  },
}
