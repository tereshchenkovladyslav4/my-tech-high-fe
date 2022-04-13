import { r as react } from './index-ec604146.js';
import { a as createTheme } from './createTheme-8608fa53.js';

const ThemeContext = /*#__PURE__*/react.createContext(null);

var ThemeContext$1 = ThemeContext;

function useTheme$2() {
  const theme = react.useContext(ThemeContext$1);

  return theme;
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function useTheme$1(defaultTheme = null) {
  const contextTheme = useTheme$2();
  return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme : contextTheme;
}

const systemDefaultTheme = createTheme();

function useTheme(defaultTheme = systemDefaultTheme) {
  return useTheme$1(defaultTheme);
}

export { ThemeContext$1 as T, useTheme$1 as a, useTheme$2 as b, useTheme as u };
