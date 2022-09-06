import { MTHBLUE } from '../../utils/constants'

export const settingClasses = {
  gridContainer: {
    textAlign: 'left' as const,
    paddingX: 4,
    marginTop: 1,
    marginBottom: 2,
  },
  activeTab: {
    backgroundColor: '#EEF4F8',
    color: 'red',
    '&.Mui-selected': {
      color: MTHBLUE,
    },
  },
  saveButton: {
    width: 200,
  },
  avatar: {
    height: '164px',
    width: '164px',
    borderRadius: 2,
  },
  accountSaveChanges: {
    minWidth: '150px',
    maxWidth: '200px',
    borderRadius: '50px',
    marginLeft: '48px',
    height: '48px',
  },
  accountSaveChangesMobile: {
    minWidth: '75px',
    maxWidth: '100px',
    borderRadius: '25px',
    marginLeft: '52px',
    height: '48px',
  },
}
