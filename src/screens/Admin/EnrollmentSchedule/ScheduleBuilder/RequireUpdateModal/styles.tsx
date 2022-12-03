import { MthColor } from '@mth/enums'

export const requireUpdateModalClasses = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    height: 'auto',
    bgcolor: MthColor.WHITE,
    borderRadius: 2,
    p: 6,
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    width: '160px',
    height: '36px',
    borderRadius: '40px',
    background: MthColor.LIGHTGRAY,
    color: MthColor.SYSTEM_01,
  },
  reqireUpdateBtn: {
    width: '160px',
    height: '36px',
    borderRadius: '40px',
    background: MthColor.BLUE_GRDIENT,
    color: MthColor.WHITE,
    marginLeft: 5,
  },
}
