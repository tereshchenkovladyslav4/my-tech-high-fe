import { MthColor } from '@mth/enums'

const IS_STAGING = import.meta.env.SNOWPACK_PUBLIC_APP_STAGE === 'staging'
const IS_DEMO = import.meta.env.SNOWPACK_PUBLIC_APP_STAGE === 'demo'

export const useStyles = {
  container: {
    position: 'fixed',
    width: '100%',
    maxWidth: 260,
    minWidth: 260,
    backgroundColor: IS_STAGING ? MthColor.LIGHTRED : IS_DEMO ? MthColor.LIGHTBLUE : MthColor.WHITE,
    height: '100vh',
    boxShadow: '0px 0px 36px rgba(0, 0, 0, 0.04)',
  },
  myTechHigh: {
    height: 75,
  },
  logos: {
    marginRight: 25,
  },
  sideMenuText: {
    color: '#CCCCCC',
  },
  navLink: {
    textDecoration: 'none',
    color: MthColor.BLACK,
    borderLeft: `3px solid ${IS_STAGING ? MthColor.LIGHTRED : IS_DEMO ? MthColor.LIGHTBLUE : MthColor.WHITE}`,
    display: 'flex',
  },
  activeNavLink: {
    backgroundColor: MthColor.ACTIVE_LINK_BG,
    color: MthColor.MTHBLUE,
    borderLeft: `3px solid ${MthColor.MTHBLUE}`,
  },
  navbar: {
    height: '100%',
    width: '100%',
  },
  logoTitle: {
    marginTop: '25px',
  },
  // mobile
  mobileContainer: {
    position: 'fixed',
    width: '100%',
    bgcolor: '#fff',
    height: '100vh',
  },
  mobileNavText: {
    lineHeight: '2',
    fontSize: '32px',
    fontWeight: '700',
    color: '#0E0E0E',
  },
}
