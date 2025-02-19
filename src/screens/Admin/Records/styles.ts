import { MthColor } from '@mth/enums'

export const recordClasses = {
  btnGroup: {
    justifyContent: 'flex-end',
    display: 'flex',
    height: '100%',
    alignItems: 'end',
    flexDirection: 'row',
  },
  record: {
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    border: '1px solid #ccc',
    padding: 2,
    borderRadius: 3,
  },
  clearAllBtn: {
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    background: MthColor.RED_GRADIENT,
    color: MthColor.LIGHTGRAY,
    letterSpacing: '1px',
    width: '140px',
  },
  filterBtn: {
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    textTransform: 'none',
    letterSpacing: '1px',
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    color: MthColor.LIGHTGRAY,
    width: '140px',
  },
  dropDownContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    mt: 3,
    marginLeft: '-13px',
    alignItems: 'left',
  },
  header: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateGroup: {
    display: 'flex',
    my: 1,
    gap: '6px',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
  expandIcon: {
    color: MthColor.MTHBLUE,
    verticalAlign: 'bottom',
    cursor: 'pointer',
    marginBottom: 'auto',
    marginTop: 'auto',
    fontSize: '25px',
  },
}
