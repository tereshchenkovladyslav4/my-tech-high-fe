import { MthColor } from '@mth/enums'

export const scheduleBuilderClass = {
  container: {
    paddingRight: '46px',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0px 34px 20px',
    margin: '28px 34px 16px 30px',
    minHeight: '820px',
  },

  table: {
    marginTop: '28px',
    paddingRight: '10px',
    position: 'relative',
    '& table': {
      '& p': {
        fontSize: '14px',
      },
      '& th': {
        fontSize: '16px',
        paddingLeft: 0,
        paddingRight: 0,
      },
      '& tbody': {
        fontSize: '14px',
        '& tr': {
          '& td': {
            padding: 0,
            borderBottom: `1px solid ${MthColor.SYSTEM_08} !important`,
            '& .periodBox': {
              display: 'flex',
              columnGap: '23px',
              alignItems: 'center',
            },
            '&:last-child': {
              borderBottom: 'none !important',
            },
          },
        },
        '& tr:last-child td': {
          borderBottom: 'none !important',
        },
      },
      '& .cell-item': {
        padding: '20px 0px 20px 0px',
        borderLeft: 'none !important',
      },
    },
    '& > button': {
      position: 'absolute',
      top: 0,
      right: '40px',
      color: MthColor.MTHBLUE,
    },
  },

  submit: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '38px',
    marginTop: '65px',
    paddingRight: '46px',
    '& button': {
      height: '48px',
      width: '160px',
      fontSize: '14px',
      borderRadius: '8px',
      '&:last-child': {
        marginLeft: 'auto',
        background: 'transparent',
        color: MthColor.MTHBLUE,
      },
    },
  },
}
