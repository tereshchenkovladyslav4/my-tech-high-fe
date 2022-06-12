import { MTHBLUE } from '../../utils/constants'

export const useStyles = {
  textfield: {
    width: '100%',
    height: '45px',
    margin: '16px 0',
  },
  alternate: {
    width: '100%',
    height: '45px',
    margin: '16px 0',
    '& .MuiSvgIcon-root': {
      color: MTHBLUE,
      alignSelf: 'center',
      justifyContent: 'center',
    },
  },
}
