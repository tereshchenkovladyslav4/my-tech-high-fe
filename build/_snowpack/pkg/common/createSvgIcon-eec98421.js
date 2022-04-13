import { _ as _extends } from './extends-7477639a.js';
import { r as react } from './index-ec604146.js';
import { j as jsxRuntime } from './jsx-runtime-016d8413.js';
import { _ as _objectWithoutPropertiesLoose } from './objectWithoutPropertiesLoose-d5128f55.js';
import './index-c103191b.js';
import { c as clsx } from './clsx.m-114f790f.js';
import { g as generateUtilityClass, a as generateUtilityClasses, u as useThemeProps, c as composeClasses } from './useThemeProps-71822486.js';
import { s as styled } from './styled-4602ab3b.js';
import { c as capitalize } from './createTheme-8608fa53.js';

function getSvgIconUtilityClass(slot) {
  return generateUtilityClass('MuiSvgIcon', slot);
}
generateUtilityClasses('MuiSvgIcon', ['root', 'colorPrimary', 'colorSecondary', 'colorAction', 'colorError', 'colorDisabled', 'fontSizeInherit', 'fontSizeSmall', 'fontSizeMedium', 'fontSizeLarge']);

const _excluded = ["children", "className", "color", "component", "fontSize", "htmlColor", "titleAccess", "viewBox"];

const useUtilityClasses = ownerState => {
  const {
    color,
    fontSize,
    classes
  } = ownerState;
  const slots = {
    root: ['root', color !== 'inherit' && `color${capitalize(color)}`, `fontSize${capitalize(fontSize)}`]
  };
  return composeClasses(slots, getSvgIconUtilityClass, classes);
};

const SvgIconRoot = styled('svg', {
  name: 'MuiSvgIcon',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.color !== 'inherit' && styles[`color${capitalize(ownerState.color)}`], styles[`fontSize${capitalize(ownerState.fontSize)}`]];
  }
})(({
  theme,
  ownerState
}) => {
  var _theme$palette$ownerS, _theme$palette$ownerS2;

  return {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    transition: theme.transitions.create('fill', {
      duration: theme.transitions.duration.shorter
    }),
    fontSize: {
      inherit: 'inherit',
      small: theme.typography.pxToRem(20),
      medium: theme.typography.pxToRem(24),
      large: theme.typography.pxToRem(35)
    }[ownerState.fontSize],
    // TODO v5 deprecate, v6 remove for sx
    color: (_theme$palette$ownerS = (_theme$palette$ownerS2 = theme.palette[ownerState.color]) == null ? void 0 : _theme$palette$ownerS2.main) != null ? _theme$palette$ownerS : {
      action: theme.palette.action.active,
      disabled: theme.palette.action.disabled,
      inherit: undefined
    }[ownerState.color]
  };
});
const SvgIcon = /*#__PURE__*/react.forwardRef(function SvgIcon(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiSvgIcon'
  });

  const {
    children,
    className,
    color = 'inherit',
    component = 'svg',
    fontSize = 'medium',
    htmlColor,
    titleAccess,
    viewBox = '0 0 24 24'
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const ownerState = _extends({}, props, {
    color,
    component,
    fontSize,
    viewBox
  });

  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/jsxRuntime.jsxs(SvgIconRoot, _extends({
    as: component,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    focusable: "false",
    viewBox: viewBox,
    color: htmlColor,
    "aria-hidden": titleAccess ? undefined : true,
    role: titleAccess ? 'img' : undefined,
    ref: ref
  }, other, {
    children: [children, titleAccess ? /*#__PURE__*/jsxRuntime.jsx("title", {
      children: titleAccess
    }) : null]
  }));
});
SvgIcon.muiName = 'SvgIcon';
var SvgIcon$1 = SvgIcon;

function createSvgIcon(path, displayName) {
  const Component = (props, ref) => /*#__PURE__*/jsxRuntime.jsx(SvgIcon$1, _extends({
    "data-testid": `${displayName}Icon`,
    ref: ref
  }, props, {
    children: path
  }));

  Component.muiName = SvgIcon$1.muiName;
  return /*#__PURE__*/react.memo( /*#__PURE__*/react.forwardRef(Component));
}

export { createSvgIcon as c };
