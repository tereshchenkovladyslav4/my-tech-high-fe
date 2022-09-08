import { BUTTON_LINEAR_GRADIENT } from '../../../utils/constants'
export const useStyles = {
  base: {
    position: 'relative',
    px: 3,
    py: 4,
    margin: 3,
    background: '#fff',
    minHeight: '100%',
    borderRadius: '4px',
  },
  filter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  filterButton: {
    width: '160px',
    borderRadius: '50px',
  },
  addButton: {
    background: BUTTON_LINEAR_GRADIENT,
    color: 'white',
    px: 4,
    borderRadius: 2,
  },
}
