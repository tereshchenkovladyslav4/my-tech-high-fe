import { MthColor } from '@mth/enums'

export const resourceLevelsClasses = {
  dialog: {
    marginX: 'auto',
    padding: '32px 16px 24px',
    borderRadius: '16px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  dialogTitle: {
    fontSize: '14px',
    fontWeight: 600,
    padding: 0,
  },
  dialogAction: {
    justifyContent: 'space-between',
    padding: 0,
    gap: '32px',
  },
  cancelButton: {
    width: '200px',
    height: '48px',
    borderRadius: '40px',
    background: MthColor.LIGHTGRAY,
    color: MthColor.SYSTEM_01,
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      background: MthColor.LIGHTGRAY,
      color: MthColor.SYSTEM_01,
    },
  },
  submitButton: {
    width: '200px',
    height: '48px',
    borderRadius: '40px',
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    color: MthColor.WHITE,
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
      color: MthColor.WHITE,
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
