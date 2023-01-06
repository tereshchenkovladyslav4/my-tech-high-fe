import { createTheme } from '@mui/material/styles'
import { MthColor } from '../enums/color.enum'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
      dark: '#e6e6e6',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFFFFF',
      dark: '#fff',
      contrastText: '#000',
    },
    warning: {
      main: '#F2F2F2',
      dark: '#E7E7E7',
      contrastText: '#000',
    },
    error: {
      main: '#BD0043',
      contrastText: '#fff',
    },
    divider: '#D7D6D5',
    background: {
      paper: '#fff',
      default: '#fafafa',
    },
  },
  typography: {
    // Use the system font over Roboto.
    fontFamily: 'VisbyCF',
    htmlFontSize: 16,
    button: {
      textTransform: 'none',
    },
  },
  components: {
    // https://github.com/mui/material-ui/issues/30789
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '& .fw-700': {
            fontWeight: 700,
          },
          '& .w-28': {
            width: '112px',
          },
          '& .w-31': {
            width: '124px',
          },
          '& .w-37': {
            width: '148px',
          },
          '& .w-75': {
            width: '300px',
          },
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]': {
            MozAppearance: 'none',
            margin: 0,
          },
          '& .bg-gradient': {
            background: MthColor.BUTTON_LINEAR_GRADIENT,
          },
          '& .bg-gradient-dark': {
            background: MthColor.BUTTON_LINEAR_GRADIENT_DARK,
          },
          '& .rounded-full': {
            borderRadius: '999px',
          },
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: ({ ownerState: { max } }) => ({
          ...[...Array(max)].reduce(
            (result, _curr, index) => ({
              ...result,
              [`& > .MuiAvatar-root:nth-child(${index + 1})`]: {
                zIndex: (max || 100) - index,
              },
            }),
            {},
          ),
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0 0 0 1px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.MthFormField': {
            '& .MuiInputLabel-root:not(.Mui-error):not(.Mui-disabled)': {
              color: '#333333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset, &.Mui-focused fieldset': {
                borderWidth: '1px',
              },
              '&:not(.Mui-error):not(.Mui-disabled) fieldset, &.Mui-focused:not(.Mui-error):not(.Mui-disabled) fieldset':
                {
                  borderColor: '#333333',
                },
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '&.MthFormField': {
            '& .MuiInputLabel-root:not(.Mui-error):not(.Mui-disabled)': {
              color: '#333333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset, &.Mui-focused fieldset': {
                borderWidth: '1px',
              },
              '&:not(.Mui-error):not(.Mui-disabled) fieldset, &.Mui-focused:not(.Mui-error):not(.Mui-disabled) fieldset':
                {
                  borderColor: '#333333',
                },
            },
          },
        },
      },
    },
  },
})
