import { BUTTON_LINEAR_GRADIENT } from '../../../../../utils/constants'

export const useStyles = { 
  header: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingTop: '36px',
    justifyContent: 'space-between',
  },
  breadcrumbs: {
    marginTop: '35px',
    marginX: '70px',
  },
  submitButton: {
    borderRadius: 2,
    fontSize: 15,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    width: '451.53px',
    height: '37.14px',
    marginTop: 10,
    color: 'white',
  },
  buttonGroup: {
    padding: '0px 50px',
    display: 'flex',
    justifyContent: 'space-between',
  }
}
