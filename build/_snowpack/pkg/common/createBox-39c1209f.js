import { _ as _extends } from './extends-7477639a.js';
import { _ as _objectWithoutPropertiesLoose } from './objectWithoutPropertiesLoose-d5128f55.js';
import { r as react } from './index-ec604146.js';
import './index-c103191b.js';
import { c as clsx } from './clsx.m-114f790f.js';
import { s as styled, d as defaultStyleFunctionSx } from './styleFunctionSx-92f1f5f7.js';
import { u as useTheme } from './useTheme-1877cd46.js';
import { j as jsxRuntime } from './jsx-runtime-016d8413.js';
import { e as extendSxProp } from './extendSxProp-324ddf47.js';

const _excluded = ["className", "component"];
function createBox(options = {}) {
  const {
    defaultTheme,
    defaultClassName = 'MuiBox-root',
    generateClassName,
    styleFunctionSx = defaultStyleFunctionSx
  } = options;
  const BoxRoot = styled('div')(styleFunctionSx);
  const Box = /*#__PURE__*/react.forwardRef(function Box(inProps, ref) {
    const theme = useTheme(defaultTheme);

    const _extendSxProp = extendSxProp(inProps),
          {
      className,
      component = 'div'
    } = _extendSxProp,
          other = _objectWithoutPropertiesLoose(_extendSxProp, _excluded);

    return /*#__PURE__*/jsxRuntime.jsx(BoxRoot, _extends({
      as: component,
      ref: ref,
      className: clsx(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
      theme: theme
    }, other));
  });
  return Box;
}

export { createBox as c };
