import { MthColor } from '@mth/enums'

export const stateCodesClass = {
  flexCenterBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 4,
  },
  flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  tooltipBtn: {
    backgroundColor: '#767676',
    fontSize: '16px',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 9,
    paddingBottom: 9,
  },
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflowY: 'auto',
    maxHeight: '97vh',
  },
  formError: {
    color: MthColor.RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginLeft: '12px',
    marginTop: '4px',
  },
}
