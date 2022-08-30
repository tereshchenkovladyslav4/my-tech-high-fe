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
})
