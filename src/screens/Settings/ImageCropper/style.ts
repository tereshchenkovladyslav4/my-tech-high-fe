import { MthColor } from '@mth/enums'

export const siteManagementClassess = {
  base: {
    position: 'relative',
    px: 4,
    background: '#fff',
    minHeight: '100%',
    width: '95%',
    margin: 'auto',
    pb: 4,
    pt: 4,
  },
  button: {
    borderRadius: 2,
    fontSize: 12,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    width: '100%',
    height: 37,
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
      color: 'white',
    },
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
  programSettingHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '16px',
  },
  arrowIcon: {
    fontSize: '15px',
    stroke: 'black',
    strokeWidth: 2,
  },
  iconButton: {
    position: 'relative',
    bottom: '2px',
  },
  title: {
    paddingLeft: '7px',
    fontSize: '20px',
    fontWeight: '700',
  },
  verticalLine: {
    borderLeft: '1px solid #000',
    minHeight: '40px',
  },
  selectBox: {
    paddingLeft: '29px',
    borderRadius: '8px',
    alignItems: 'center',
    paddingY: 2,
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
  gradeBox: {
    '& > :not(style)': { m: 1, paddingLeft: 2 },
  },
  dialogTitle: {
    fontWeight: 'bold',
    marginTop: '10px',
    textAlign: 'left',
  },
  dialogAction: {
    justifyContent: 'center',
    marginBottom: 2,
  },
  formGroup: {
    marginLeft: '24px',
    marginRight: '150px',
    marginBottom: '40px',
  },
  imageCropper: {
    marginX: 'auto',
    paddingY: '10px',
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  imageCropperDialogTitle: {
    fontWeight: 'bold',
    marginTop: '10px',
    textAlign: 'left',
  },
}
