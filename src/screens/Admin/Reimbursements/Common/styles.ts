import BGSVG from '@mth/assets/AdminApplicationBG.svg'

export const requestComponentClasses = {
  container: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '500px',
    backgroundImage: `url(${BGSVG})`,
    alignItems: 'center',
    paddingTop: 12,
  },
}
