import { createTheme } from '@mui/material/styles'

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
  },
})
