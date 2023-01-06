import { MthColor } from '@mth/enums'

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
    marginX: { xs: '30px', sm: '70px' },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row-reverse' as const,
    marginRight: { xs: 0, sm: '70px' },
    justifyContent: { xs: 'center', sm: 'space-between' },
    marginY: '24px',
    width: '100%',
  },
  button: {
    background: MthColor.BUTTON_LINEAR_GRADIENT,
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
  pageNumber: {
    fontSize: '20.62px',
    fontWeight: '700',
    marginX: '40px',
  },
  pageArrow: {
    display: 'block',
    color: '#323232',
    background: '#FAFAFA',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
  },
}
