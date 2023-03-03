import { MthColor } from '@mth/enums'

export const editTitleClasses = {
  formError: {
    color: MthColor.RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginLeft: '12px',
    marginTop: '4px',
  },
  accordion: {
    boxShadow: 'none',
    '& .MuiAccordionSummary-root': {
      justifyContent: 'start',
      '&.Mui-expanded': {
        minHeight: 'unset',
      },
      '& .MuiAccordionSummary-content': {
        flexGrow: 'inherit',
        fontSize: '18px',
        fontWeight: '600',
        margin: '12px 8px 12px 0',
        '&.Mui-expanded': {
          margin: '12px 8px 12px 0',
        },
      },
    },
  },
}
