import { _ as _objectWithoutPropertiesLoose } from './objectWithoutPropertiesLoose-d5128f55.js';
import { _ as _extends } from './extends-7477639a.js';
import { r as react } from './index-ec604146.js';
import './index-c103191b.js';
import { c as clsx } from './clsx.m-114f790f.js';
import { s as styled, r as rootShouldForwardProp } from './styled-4602ab3b.js';
import { g as generateUtilityClass, a as generateUtilityClasses, u as useThemeProps, c as composeClasses } from './useThemeProps-71822486.js';
import { L as ListContext } from './ListContext-d3b6b08c.js';
import { j as jsxRuntime } from './jsx-runtime-016d8413.js';
import { B as ButtonBase } from './ButtonBase-f345fbbb.js';
import { a as alpha } from './createTheme-92b2b11b.js';
import { u as useEnhancedEffect, b as useForkRef } from './useForkRef-36ee4a49.js';

function getDividerUtilityClass(slot) {
  return generateUtilityClass('MuiDivider', slot);
}
const dividerClasses = generateUtilityClasses('MuiDivider', ['root', 'absolute', 'fullWidth', 'inset', 'middle', 'flexItem', 'light', 'vertical', 'withChildren', 'withChildrenVertical', 'textAlignRight', 'textAlignLeft', 'wrapper', 'wrapperVertical']);
var dividerClasses$1 = dividerClasses;

const listItemIconClasses = generateUtilityClasses('MuiListItemIcon', ['root', 'alignItemsFlexStart']);
var listItemIconClasses$1 = listItemIconClasses;

function getListItemTextUtilityClass(slot) {
  return generateUtilityClass('MuiListItemText', slot);
}
const listItemTextClasses = generateUtilityClasses('MuiListItemText', ['root', 'multiline', 'dense', 'inset', 'primary', 'secondary']);
var listItemTextClasses$1 = listItemTextClasses;

function getMenuItemUtilityClass(slot) {
  return generateUtilityClass('MuiMenuItem', slot);
}
const menuItemClasses = generateUtilityClasses('MuiMenuItem', ['root', 'focusVisible', 'dense', 'disabled', 'divider', 'gutters', 'selected']);
var menuItemClasses$1 = menuItemClasses;

const _excluded = ["autoFocus", "component", "dense", "divider", "disableGutters", "focusVisibleClassName", "role", "tabIndex"];
const overridesResolver = (props, styles) => {
  const {
    ownerState
  } = props;
  return [styles.root, ownerState.dense && styles.dense, ownerState.divider && styles.divider, !ownerState.disableGutters && styles.gutters];
};

const useUtilityClasses = ownerState => {
  const {
    disabled,
    dense,
    divider,
    disableGutters,
    selected,
    classes
  } = ownerState;
  const slots = {
    root: ['root', dense && 'dense', disabled && 'disabled', !disableGutters && 'gutters', divider && 'divider', selected && 'selected']
  };
  const composedClasses = composeClasses(slots, getMenuItemUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};

const MenuItemRoot = styled(ButtonBase, {
  shouldForwardProp: prop => rootShouldForwardProp(prop) || prop === 'classes',
  name: 'MuiMenuItem',
  slot: 'Root',
  overridesResolver
})(({
  theme,
  ownerState
}) => _extends({}, theme.typography.body1, {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  textDecoration: 'none',
  minHeight: 48,
  paddingTop: 6,
  paddingBottom: 6,
  boxSizing: 'border-box',
  whiteSpace: 'nowrap'
}, !ownerState.disableGutters && {
  paddingLeft: 16,
  paddingRight: 16
}, ownerState.divider && {
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundClip: 'padding-box'
}, {
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: theme.palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: 'transparent'
    }
  },
  [`&.${menuItemClasses$1.selected}`]: {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    [`&.${menuItemClasses$1.focusVisible}`]: {
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
    }
  },
  [`&.${menuItemClasses$1.selected}:hover`]: {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
    }
  },
  [`&.${menuItemClasses$1.focusVisible}`]: {
    backgroundColor: theme.palette.action.focus
  },
  [`&.${menuItemClasses$1.disabled}`]: {
    opacity: theme.palette.action.disabledOpacity
  },
  [`& + .${dividerClasses$1.root}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  [`& + .${dividerClasses$1.inset}`]: {
    marginLeft: 52
  },
  [`& .${listItemTextClasses$1.root}`]: {
    marginTop: 0,
    marginBottom: 0
  },
  [`& .${listItemTextClasses$1.inset}`]: {
    paddingLeft: 36
  },
  [`& .${listItemIconClasses$1.root}`]: {
    minWidth: 36
  }
}, !ownerState.dense && {
  [theme.breakpoints.up('sm')]: {
    minHeight: 'auto'
  }
}, ownerState.dense && _extends({
  minHeight: 32,
  // https://material.io/components/menus#specs > Dense
  paddingTop: 4,
  paddingBottom: 4
}, theme.typography.body2, {
  [`& .${listItemIconClasses$1.root} svg`]: {
    fontSize: '1.25rem'
  }
})));
const MenuItem = /*#__PURE__*/react.forwardRef(function MenuItem(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiMenuItem'
  });

  const {
    autoFocus = false,
    component = 'li',
    dense = false,
    divider = false,
    disableGutters = false,
    focusVisibleClassName,
    role = 'menuitem',
    tabIndex: tabIndexProp
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const context = react.useContext(ListContext);
  const childContext = {
    dense: dense || context.dense || false,
    disableGutters
  };
  const menuItemRef = react.useRef(null);
  useEnhancedEffect(() => {
    if (autoFocus) {
      if (menuItemRef.current) {
        menuItemRef.current.focus();
      }
    }
  }, [autoFocus]);

  const ownerState = _extends({}, props, {
    dense: childContext.dense,
    divider,
    disableGutters
  });

  const classes = useUtilityClasses(props);
  const handleRef = useForkRef(menuItemRef, ref);
  let tabIndex;

  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return /*#__PURE__*/jsxRuntime.jsx(ListContext.Provider, {
    value: childContext,
    children: /*#__PURE__*/jsxRuntime.jsx(MenuItemRoot, _extends({
      ref: handleRef,
      role: role,
      tabIndex: tabIndex,
      component: component,
      focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName)
    }, other, {
      ownerState: ownerState,
      classes: classes
    }))
  });
});
var __pika_web_default_export_for_treeshaking__ = MenuItem;

export { __pika_web_default_export_for_treeshaking__ as _, getListItemTextUtilityClass as a, getDividerUtilityClass as g, listItemTextClasses$1 as l };
