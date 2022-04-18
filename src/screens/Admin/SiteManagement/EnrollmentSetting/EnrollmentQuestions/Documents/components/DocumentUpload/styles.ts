import { BUTTON_LINEAR_GRADIENT } from '../../../../../../../../utils/constants'

export const useStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    borderRadius: 2,
    border: 1,
    borderColor: '#E7E7E7',
    paddingTop: '18px',
    paddingX: '18px',
  },
  buttonContainer: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between',
    marginTop: '36px',
  },
  button: {
    padding: '17px 48px',
    borderRadius: '8px',
    background: BUTTON_LINEAR_GRADIENT,
    color: 'white',
    alignSelf: 'flex-end',
    marginBottom: '20px',
  },
}
