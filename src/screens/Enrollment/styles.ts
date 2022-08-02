import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'

export const useStyles = {
  container: {
    margin: 0,
    marginTop: '32px',
    textAlign: 'left' as const,
    marginBottom: '32px',
    maxWidth: '100% !important',
  },
  header: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingTop: '16px',
    paddingX: '28px',
    justifyContent: 'space-between',
  },
  enrollmentHeader: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  chevronIcon: {
    marginRight: '16px',
    cursor: 'pointer',
    color: '#323232',
    alignSelf: 'center',
  },
  breadcrumbs: {
    marginTop: '35px',
    marginX: '70px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row-reverse' as const,
    marginRight: '70px',
    marginY: '24px',
    width: '100%',
  },
  button: {
    background: BUTTON_LINEAR_GRADIENT,
    color: 'white',
    alignSelf: 'flex-end' as const,
    paddingTop: '17px',
    paddingBottom: '17px',
    paddingLeft: '52px',
    paddingRight: '52px',
    borderRadius: 2,
  },
  documentButton: {
    minWidth: '150px',
    maxWidth: '200px',
    height: '48px',
    marginLeft: '12px',
    marginTop: 2,
  },
}
