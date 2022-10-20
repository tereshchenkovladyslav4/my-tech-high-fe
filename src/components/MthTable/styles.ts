import { MthColor } from '@mth/enums'

export const mthTableClasses = {
  table: {
    '& th': {
      fontSize: '18px',
      fontWeight: '700',
      padding: '11px 16px',
    },
    '& td': {
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
    },
    '& > tbody > tr:nth-child(2n + 0) td': {
      backgroundColor: 'white !important',
    },
    '& .actionButton': {
      width: '32px',
      height: '32px',
      margin: '0 4px',
      '& .MuiSvgIcon-root': {
        fontSize: '20px',
      },
      '&.Mui-disabled': {
        '& .MuiSvgIcon-root': {
          color: '#A3A3A4',
        },
      },
    },
    '&.small': {
      '& th': {
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 16px',
      },
      '& td': {
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    '& .checkWrap': {
      padding: '2px 4px 2px 0 !important',
      width: '48px',
      textAlign: 'center',
    },
    '&.noOddBg .MuiTableRow-root .MuiTableCell-root': {
      background: 'none !important',
      borderBottom: `1px solid ${MthColor.SYSTEM_09}`,
    },
    // '& .MuiTableCell-root': {
    //   borderBottomColor: MthColor.SYSTEM_09,
    // },
    '&.noBorderBottom > .MuiTableBody-root, &.noBorderBottom > .MuiTableHead-root': {
      '& > .MuiTableRow-root > .MuiTableCell-root': {
        borderBottom: 'none',
      },
    },
    '& > .MuiTableBody-root > .MuiTableRow-root:last-child > .MuiTableCell-root': {
      borderBottom: 'none',
    },
    '& .expandButton': {
      transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    '& .MuiTableRow-root.expanded .expandButton': {
      transform: 'rotate(180deg)',
    },
  },
}
