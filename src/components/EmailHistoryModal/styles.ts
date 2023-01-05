import { MthColor } from '@mth/enums'

export const emailHistoryModalClasses = {
  close: {
    background: 'black',
    borderRadius: 2,
    color: MthColor.WHITE,
    cursor: 'pointer',
  },
  modalHistoryContent: {
    padding: '15px',
  },
  emailRowHead: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  },
  emailLabel: {
    width: '135px',
    display: 'flex',
    alignItems: 'center',
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    cursor: 'pointer',
  },
  emailViewContent: {
    padding: '0 50px',
  },
  historySubject: {
    marginTop: '30px',
    minHeight: '50px',
    border: '1px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '5px',
    padding: '12px 20px',
  },
  body: {
    border: '1px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '5px',
    minHeight: '360px',
    padding: '30px',
    marginBottom: '50px',
  },
}
