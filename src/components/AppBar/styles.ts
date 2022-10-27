import { MthColor } from '@mth/enums'

const IS_STAGING = import.meta.env.SNOWPACK_PUBLIC_APP_STAGE === 'staging'
const IS_DEMO = import.meta.env.SNOWPACK_PUBLIC_APP_STAGE === 'demo'

export const useStyles = {
  appBar: {
    backgroundColor: IS_STAGING ? MthColor.LIGHTBLUE : IS_DEMO ? MthColor.LIGHTRED : MthColor.WHITE,
    height: 85,
    paddingX: 3,
    alignItems: 'flex-end',
  },
  toolbar: {
    width: '100%',
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
  appMobileBar: {
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  studentItemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
