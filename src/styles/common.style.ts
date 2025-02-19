import { MthColor } from '@mth/enums'
import { desktopHeaderHeight, desktopPagePb, desktopPagePt } from '@mth/styles/variables.style'

export const commonClasses = {
  mainLayout: { p: 4, textAlign: 'left' },
  mainBlock: { p: 4, borderRadius: '12px', boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)' },
  fitScreen: {
    minHeight: `calc(100vh - (${desktopHeaderHeight} + ${desktopPagePt} + ${desktopPagePb}))`,
  },
  modalWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: 'auto',
    backgroundColor: MthColor.WHITE,
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    /* Below parameters should be customized */
    maxWidth: '440px',
    p: 3,
    outline: '0',
  },
  formError: {
    color: MthColor.RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginLeft: '12px',
    marginTop: '4px',
  },
  formErrorTop: {
    color: MthColor.RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginLeft: '12px',
    marginBottom: '4px',
  },
}
