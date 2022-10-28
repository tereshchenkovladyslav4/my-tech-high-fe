export const headerClass = {
  headerMain: {
    paddingRight: '46px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& button:first-of-type': {
      position: 'relative',
      '& svg': {
        fontSize: '15px',
        color: 'black',
        strokeWidth: 1,
      },
    },
    '& p': {
      fontSize: '20px',
      margin: '0 12px 0 24px',
    },
    '& div': {
      marginLeft: 'auto',
    },
  },
}
