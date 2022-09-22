import { MthColor } from '@mth/enums'

export const useStyles = {
  table: {
    '& td': {
      padding: '2px 4px 2px 0',
      fontSize: 14,
      textAlign: 'left',
    },
    '& th': {
      fontWeight: 700,
      fontSize: 15,
      padding: '2px 2px 9px 14px',
    },
    '&.striped tbody tr:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    '&.bordered-l .cell-item.border-l': {
      borderLeft: '1px solid black',
    },
    '&.bordered-b tbody td': {
      borderBottom: `1px solid ${MthColor.SYSTEM_09}`,
    },
    '&.table-sm th, &.table-sm td': {
      fontSize: 12,
    },
    '&.table-lg th': {
      fontSize: 18,
    },
    '&.table-checkable tr td:first-of-type, &.table-checkable tr th:first-of-type': {
      padding: 0,
      width: '40px',
    },
  },
}
