import { r as react } from '../../common/index-ec604146.js';
import '../../common/index-c103191b.js';
import { b as useTheme, T as ThemeContext, u as useTheme$1 } from '../../common/useTheme-1877cd46.js';
import { j as jsxRuntime } from '../../common/jsx-runtime-016d8413.js';
import { _ as _extends } from '../../common/extends-7477639a.js';
import { T as ThemeContext$1 } from '../../common/emotion-element-99289b21.browser.esm-55d2e454.js';
import '../../common/_commonjsHelpers-37fa8da4.js';
import '../../common/createTheme-8608fa53.js';
import '../../common/objectWithoutPropertiesLoose-d5128f55.js';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;
var nested = hasSymbol ? Symbol.for('mui.nested') : '__THEME_NESTED__';

function mergeOuterLocalTheme(outerTheme, localTheme) {
  if (typeof localTheme === 'function') {
    const mergedTheme = localTheme(outerTheme);

    return mergedTheme;
  }

  return _extends({}, outerTheme, localTheme);
}
/**
 * This component takes a `theme` prop.
 * It makes the `theme` available down the React tree thanks to React context.
 * This component should preferably be used at **the root of your component tree**.
 */


function ThemeProvider$1(props) {
  const {
    children,
    theme: localTheme
  } = props;
  const outerTheme = useTheme();

  const theme = react.useMemo(() => {
    const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);

    if (output != null) {
      output[nested] = outerTheme !== null;
    }

    return output;
  }, [localTheme, outerTheme]);
  return /*#__PURE__*/jsxRuntime.jsx(ThemeContext.Provider, {
    value: theme,
    children: children
  });
}

function InnerThemeProvider(props) {
  const theme = useTheme$1();
  return /*#__PURE__*/jsxRuntime.jsx(ThemeContext$1.Provider, {
    value: typeof theme === 'object' ? theme : {},
    children: props.children
  });
}
/**
 * This component makes the `theme` available down the React tree.
 * It should preferably be used at **the root of your component tree**.
 */

function ThemeProvider(props) {
  const {
    children,
    theme: localTheme
  } = props;
  return /*#__PURE__*/jsxRuntime.jsx(ThemeProvider$1, {
    theme: localTheme,
    children: /*#__PURE__*/jsxRuntime.jsx(InnerThemeProvider, {
      children: children
    })
  });
}

export { ThemeProvider as default };
