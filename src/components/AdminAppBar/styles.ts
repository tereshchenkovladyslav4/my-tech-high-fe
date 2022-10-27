import { MthColor } from '@mth/enums'

const IS_STAGING = import.meta.env.SNOWPACK_PUBLIC_APP_STAGE === 'staging'
const IS_DEMO = import.meta.env.SNOWPACK_PUBLIC_APP_STAGE === 'demo'

export const useStyles = {
  appBar: {
    backgroundColor: IS_STAGING ? MthColor.LIGHTBLUE : IS_DEMO ? MthColor.LIGHTRED : MthColor.WHITE,
    height: 83,
    paddingX: 5,
  },
  toolbar: {
    width: 'calc(100% - 30px)',
    maxWidth: 'calc(100% - 30px)',
    marginTop: 10,
  },

  divider: {
    height: '75%',
    alignSelf: 'center',
    zIndex: 100,
    borderWidth: '2px',
  },
  icon: {
    color: 'black',
    marginRight: 24,
  },
  searchList: {
    width: '100%',
    position: 'absolute',
    color: 'black',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: '4px',
    boxShadow: 24,
    zIndex: 100,
  },
}
