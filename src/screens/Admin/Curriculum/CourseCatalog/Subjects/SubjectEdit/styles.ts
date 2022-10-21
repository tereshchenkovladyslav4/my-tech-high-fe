import { MthColor } from '@mth/enums'

export const editSubjectClasses = {
  formError: {
    color: MthColor.ERROR_RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginLeft: '12px',
    marginTop: '4px',
  },
  focusBorderColor: {
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderWidth: '1px',
        borderColor: MthColor.SYSTEM_06,
      },
      '&.Mui-error': {
        '&.Mui-focused fieldset': {
          borderColor: MthColor.ERROR_RED,
        },
      },
    },
  },
}
