import {createTheme} from "../../_snowpack/pkg/@mui/material/styles.js";
export const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
      dark: "#e6e6e6",
      contrastText: "#fff"
    },
    secondary: {
      main: "#FFFFFF",
      dark: "#fff",
      contrastText: "#000"
    },
    error: {
      main: "#BD0043",
      contrastText: "#fff"
    },
    divider: "#D7D6D5",
    background: {
      paper: "#fff",
      default: "#e6e6e6"
    }
  },
  typography: {
    fontFamily: "VisbyCF",
    htmlFontSize: 16,
    button: {
      textTransform: "none"
    }
  }
});
