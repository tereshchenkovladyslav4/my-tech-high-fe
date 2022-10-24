import { desktopHeaderHeight, desktopPagePb, desktopPagePt } from '@mth/styles/variables.style'

export const commonClasses = {
  mainLayout: { p: 4, textAlign: 'left' },
  mainBlock: { p: 4, borderRadius: '12px', boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)' },
  fitScreen: {
    minHeight: `calc(100vh - (${desktopHeaderHeight} + ${desktopPagePt} + ${desktopPagePb}))`,
  },
}
