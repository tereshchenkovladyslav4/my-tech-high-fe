import { _ as _extends } from '../../common/extends-7477639a.js';
import { _ as _objectWithoutPropertiesLoose } from '../../common/objectWithoutPropertiesLoose-d5128f55.js';
import { r as react } from '../../common/index-ec604146.js';
import { p as propTypes } from '../../common/index-c103191b.js';
import { j as jsxRuntime } from '../../common/jsx-runtime-016d8413.js';
import { b as getThemeProps, u as useThemeProps, g as generateUtilityClass$1, a as generateUtilityClasses$1, c as composeClasses$1 } from '../../common/useThemeProps-71822486.js';
import { a as useTheme } from '../../common/useTheme-1877cd46.js';
import { u as useEnhancedEffect, b as useForkRef, a as useEventCallback } from '../../common/useForkRef-36ee4a49.js';
import { M as MuiPickersAdapterContext } from '../../common/LocalizationProvider-7a7d2dc8.js';
import { f as formatMuiErrorMessage, c as capitalize } from '../../common/createTheme-8608fa53.js';
import { c as clsx } from '../../common/clsx.m-114f790f.js';
import { c as createSvgIcon } from '../../common/createSvgIcon-eec98421.js';
import { s as styled } from '../../common/styled-4602ab3b.js';
import { G as Grid, T as Typography, I as IconButton, P as Popper, D as DialogActions, a as InputAdornment, d as dialogTitleClasses, b as Dialog, c as dialogClasses } from '../../common/Dialog-e69d40d2.js';
import { P as Paper, U as Unstable_TrapFocus, G as Grow, u as useTheme$1, F as Fade } from '../../common/Modal-73ae9e65.js';
import { _ as __pika_web_default_export_for_treeshaking__$1 } from '../../common/Button-8abbe4b9.js';
import { o as ownerDocument } from '../../common/ownerWindow-46387254.js';
import { u as useControlled } from '../../common/useControlled-fa3315d7.js';
import { u as useId } from '../../common/useId-1c9d1600.js';
import { a as alpha } from '../../common/createTheme-92b2b11b.js';
import { T as TransitionGroup } from '../../common/TransitionGroup-b49fa35d.js';
import { B as ButtonBase } from '../../common/ButtonBase-f345fbbb.js';
import { C as CSSTransition } from '../../common/CSSTransition-f8a4ff6f.js';
import '../../common/_commonjsHelpers-37fa8da4.js';
import '../../common/createStyled-bbf1336f.js';
import '../../common/styleFunctionSx-92f1f5f7.js';
import '../../common/emotion-styled.browser.esm-bb03207f.js';
import '../../common/unitless.browser.esm-685a32d0.js';
import '../../common/emotion-element-99289b21.browser.esm-55d2e454.js';
import '../../common/extendSxProp-324ddf47.js';
import '../../common/FormControlContext-e4de995a.js';
import '../../common/useFormControl-33587d0f.js';
import '../../common/Transition-900f5349.js';
import '../../common/inheritsLoose-978d85dc.js';
import '../../common/setPrototypeOf-adc775f4.js';
import '../../common/index-0aa87803.js';
import '../../common/TransitionGroupContext-778caaa1.js';
import '../../common/assertThisInitialized-8eae6022.js';
import '../../common/emotion-react.browser.esm-c7ac36b2.js';
import '../../common/hoist-non-react-statics.cjs-fec7e822.js';
import '../../common/useIsFocusVisible-35a1b28f.js';

/**
 * @deprecated Not used internally. Use `MediaQueryListEvent` from lib.dom.d.ts instead.
 */

function useMediaQuery(queryInput, options = {}) {
  const theme = useTheme(); // Wait for jsdom to support the match media feature.
  // All the browsers MUI support have this built-in.
  // This defensive check is here for simplicity.
  // Most of the time, the match media logic isn't central to people tests.

  const supportMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';
  const {
    defaultMatches = false,
    matchMedia = supportMatchMedia ? window.matchMedia : null,
    noSsr = false,
    ssrMatchMedia = null
  } = getThemeProps({
    name: 'MuiUseMediaQuery',
    props: options,
    theme
  });

  let query = typeof queryInput === 'function' ? queryInput(theme) : queryInput;
  query = query.replace(/^@media( ?)/m, '');
  const [match, setMatch] = react.useState(() => {
    if (noSsr && supportMatchMedia) {
      return matchMedia(query).matches;
    }

    if (ssrMatchMedia) {
      return ssrMatchMedia(query).matches;
    } // Once the component is mounted, we rely on the
    // event listeners to return the correct matches value.


    return defaultMatches;
  });
  useEnhancedEffect(() => {
    let active = true;

    if (!supportMatchMedia) {
      return undefined;
    }

    const queryList = matchMedia(query);

    const updateMatch = () => {
      // Workaround Safari wrong implementation of matchMedia
      // TODO can we remove it?
      // https://github.com/mui-org/material-ui/pull/17315#issuecomment-528286677
      if (active) {
        setMatch(queryList.matches);
      }
    };

    updateMatch();
    queryList.addListener(updateMatch);
    return () => {
      active = false;
      queryList.removeListener(updateMatch);
    };
  }, [query, matchMedia, supportMatchMedia]);

  return match;
}

function useLocalizationContext() {
  const localization = react.useContext(MuiPickersAdapterContext);

  if (localization === null) {
    throw new Error(formatMuiErrorMessage(13));
  }

  return localization;
}

function useUtils() {
  return useLocalizationContext().utils;
}
function useDefaultDates() {
  return useLocalizationContext().defaultDates;
}
function useNow() {
  const utils = useUtils();
  const now = react.useRef(utils.date());
  return now.current;
}

const _excluded$h = ["openTo", "views", "minDate", "maxDate"];
const isYearOnlyView = views => views.length === 1 && views[0] === 'year';
const isYearAndMonthViews = views => views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;

const getFormatAndMaskByViews = (views, utils) => {
  if (isYearOnlyView(views)) {
    return {
      mask: '____',
      inputFormat: utils.formats.year
    };
  }

  if (isYearAndMonthViews(views)) {
    return {
      disableMaskedInput: true,
      inputFormat: utils.formats.monthAndYear
    };
  }

  return {
    mask: '__/__/____',
    inputFormat: utils.formats.keyboardDate
  };
};

function useDatePickerDefaultizedProps(_ref, name) {
  let {
    openTo = 'day',
    views = ['year', 'day'],
    minDate: minDateProp,
    maxDate: maxDateProp
  } = _ref,
      other = _objectWithoutPropertiesLoose(_ref, _excluded$h);

  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const minDate = minDateProp != null ? minDateProp : defaultDates.minDate;
  const maxDate = maxDateProp != null ? maxDateProp : defaultDates.maxDate; // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.

  return useThemeProps({
    props: _extends({
      views,
      openTo,
      minDate,
      maxDate
    }, getFormatAndMaskByViews(views, utils), other),
    name
  });
}

function composeClasses(slots, getUtilityClass, classes) {
  const output = {};
  Object.keys(slots).forEach( // `Objet.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
  // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
  slot => {
    output[slot] = slots[slot].reduce((acc, key) => {
      if (key) {
        if (classes && classes[key]) {
          acc.push(classes[key]);
        }

        acc.push(getUtilityClass(key));
      }

      return acc;
    }, []).join(' ');
  });
  return output;
}

const defaultGenerator = componentName => componentName;

const createClassNameGenerator = () => {
  let generate = defaultGenerator;
  return {
    configure(generator) {
      generate = generator;
    },

    generate(componentName) {
      return generate(componentName);
    },

    reset() {
      generate = defaultGenerator;
    }

  };
};

const ClassNameGenerator = createClassNameGenerator();
var ClassNameGenerator$1 = ClassNameGenerator;

const globalStateClassesMapping = {
  active: 'Mui-active',
  checked: 'Mui-checked',
  completed: 'Mui-completed',
  disabled: 'Mui-disabled',
  error: 'Mui-error',
  expanded: 'Mui-expanded',
  focused: 'Mui-focused',
  focusVisible: 'Mui-focusVisible',
  required: 'Mui-required',
  selected: 'Mui-selected'
};
function generateUtilityClass(componentName, slot) {
  const globalStateClass = globalStateClassesMapping[slot];
  return globalStateClass || `${ClassNameGenerator$1.generate(componentName)}-${slot}`;
}

function generateUtilityClasses(componentName, slots) {
  const result = {};
  slots.forEach(slot => {
    result[slot] = generateUtilityClass(componentName, slot);
  });
  return result;
}

var PenIcon = createSvgIcon( /*#__PURE__*/jsxRuntime.jsx("path", {
  d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
}), 'Pen');

var CalendarIcon = createSvgIcon( /*#__PURE__*/jsxRuntime.jsx("path", {
  d: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
}), 'Calendar');

var ClockIcon = createSvgIcon( /*#__PURE__*/jsxRuntime.jsxs(react.Fragment, {
  children: [/*#__PURE__*/jsxRuntime.jsx("path", {
    d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
  }), /*#__PURE__*/jsxRuntime.jsx("path", {
    d: "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
  })]
}), 'Clock');

var _ClockIcon, _CalendarIcon, _PenIcon;
const classes$5 = generateUtilityClasses('PrivatePickersToolbar', ['root', 'dateTitleContainer']);
const PickersToolbarRoot = styled('div')(({
  theme,
  ownerState
}) => _extends({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3)
}, ownerState.isLandscape && {
  height: 'auto',
  maxWidth: 160,
  padding: 16,
  justifyContent: 'flex-start',
  flexWrap: 'wrap'
}));
const PickersToolbarGrid = styled(Grid)({
  flex: 1
});

const getViewTypeIcon = viewType => viewType === 'clock' ? _ClockIcon || (_ClockIcon = /*#__PURE__*/jsxRuntime.jsx(ClockIcon, {
  color: "inherit"
})) : _CalendarIcon || (_CalendarIcon = /*#__PURE__*/jsxRuntime.jsx(CalendarIcon, {
  color: "inherit"
}));

function defaultGetKeyboardInputSwitchingButtonText(isKeyboardInputOpen, viewType) {
  return isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`;
}

const PickersToolbar = /*#__PURE__*/react.forwardRef(function PickersToolbar(props, ref) {
  const {
    children,
    className,
    getMobileKeyboardInputViewButtonText = defaultGetKeyboardInputSwitchingButtonText,
    isLandscape,
    isMobileKeyboardViewOpen,
    landscapeDirection = 'column',
    penIconClassName,
    toggleMobileKeyboardView,
    toolbarTitle,
    viewType = 'calendar'
  } = props;
  const ownerState = props;
  return /*#__PURE__*/jsxRuntime.jsxs(PickersToolbarRoot, {
    ref: ref,
    className: clsx(classes$5.root, className),
    ownerState: ownerState,
    children: [/*#__PURE__*/jsxRuntime.jsx(Typography, {
      color: "text.secondary",
      variant: "overline",
      children: toolbarTitle
    }), /*#__PURE__*/jsxRuntime.jsxs(PickersToolbarGrid, {
      container: true,
      justifyContent: "space-between",
      className: classes$5.dateTitleContainer,
      direction: isLandscape ? landscapeDirection : 'row',
      alignItems: isLandscape ? 'flex-start' : 'flex-end',
      children: [children, /*#__PURE__*/jsxRuntime.jsx(IconButton, {
        onClick: toggleMobileKeyboardView,
        className: penIconClassName,
        color: "inherit",
        "aria-label": getMobileKeyboardInputViewButtonText(isMobileKeyboardViewOpen, viewType),
        children: isMobileKeyboardViewOpen ? getViewTypeIcon(viewType) : _PenIcon || (_PenIcon = /*#__PURE__*/jsxRuntime.jsx(PenIcon, {
          color: "inherit"
        }))
      })]
    })]
  });
});
var PickersToolbar$1 = PickersToolbar;

const _excluded$g = ["date", "isLandscape", "isMobileKeyboardViewOpen", "onChange", "toggleMobileKeyboardView", "toolbarFormat", "toolbarPlaceholder", "toolbarTitle", "views"];
const classes$4 = generateUtilityClasses('PrivateDatePickerToolbar', ['penIcon']);
const DatePickerToolbarRoot = styled(PickersToolbar$1)({
  [`& .${classes$4.penIcon}`]: {
    position: 'relative',
    top: 4
  }
});
const DatePickerToolbarTitle = styled(Typography)(({
  ownerState
}) => _extends({}, ownerState.isLandscape && {
  margin: 'auto 16px auto auto'
}));
/**
 * @ignore - internal component.
 */

const DatePickerToolbar = /*#__PURE__*/react.forwardRef(function DatePickerToolbar(props, ref) {
  const {
    date,
    isLandscape,
    isMobileKeyboardViewOpen,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarPlaceholder = '––',
    toolbarTitle = 'Select date',
    views
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$g);

  const utils = useUtils();
  const dateText = react.useMemo(() => {
    if (!date) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(date, toolbarFormat);
    }

    if (isYearOnlyView(views)) {
      return utils.format(date, 'year');
    }

    if (isYearAndMonthViews(views)) {
      return utils.format(date, 'month');
    } // Little localization hack (Google is doing the same for android native pickers):
    // For english localization it is convenient to include weekday into the date "Mon, Jun 1".
    // For other locales using strings like "June 1", without weekday.


    return /en/.test(utils.getCurrentLocaleCode()) ? utils.format(date, 'normalDateWithWeekday') : utils.format(date, 'normalDate');
  }, [date, toolbarFormat, toolbarPlaceholder, utils, views]);
  const ownerState = props;
  return /*#__PURE__*/jsxRuntime.jsx(DatePickerToolbarRoot, _extends({
    ref: ref,
    toolbarTitle: toolbarTitle,
    isMobileKeyboardViewOpen: isMobileKeyboardViewOpen,
    toggleMobileKeyboardView: toggleMobileKeyboardView,
    isLandscape: isLandscape,
    penIconClassName: classes$4.penIcon,
    ownerState: ownerState
  }, other, {
    children: /*#__PURE__*/jsxRuntime.jsx(DatePickerToolbarTitle, {
      variant: "h4",
      align: isLandscape ? 'left' : 'center',
      ownerState: ownerState,
      children: dateText
    })
  }));
});
var DatePickerToolbar$1 = DatePickerToolbar;

/**
 * TODO consider getting rid from wrapper variant
 * @ignore - internal component.
 */
const WrapperVariantContext = /*#__PURE__*/react.createContext(null);

const _excluded$f = ["onClick", "onTouchStart"];
const PickersPopperRoot = styled(Popper)(({
  theme
}) => ({
  zIndex: theme.zIndex.modal
}));
const PickersPopperPaper = styled(Paper)(({
  ownerState
}) => _extends({
  transformOrigin: 'top center',
  outline: 0
}, ownerState.placement === 'top' && {
  transformOrigin: 'bottom center'
}));
const PickersPopperAction = styled(DialogActions)(({
  ownerState
}) => _extends({}, ownerState.clearable ? {
  justifyContent: 'flex-start',
  '& > *:first-of-type': {
    marginRight: 'auto'
  }
} : {
  padding: 0
}));

function clickedRootScrollbar(event, doc) {
  return doc.documentElement.clientWidth < event.clientX || doc.documentElement.clientHeight < event.clientY;
}
/**
 * Based on @mui/material/ClickAwayListener without the customization.
 * We can probably strip away even more since children won't be portaled.
 * @param onClickAway
 * @param onClick
 * @param onTouchStart
 */


function useClickAwayListener(active, onClickAway) {
  const movedRef = react.useRef(false);
  const syntheticEventRef = react.useRef(false);
  const nodeRef = react.useRef(null);
  const activatedRef = react.useRef(false);
  react.useEffect(() => {
    if (!active) {
      return undefined;
    } // Ensure that this hook is not "activated" synchronously.
    // https://github.com/facebook/react/issues/20074


    function armClickAwayListener() {
      activatedRef.current = true;
    }

    document.addEventListener('mousedown', armClickAwayListener, true);
    document.addEventListener('touchstart', armClickAwayListener, true);
    return () => {
      document.removeEventListener('mousedown', armClickAwayListener, true);
      document.removeEventListener('touchstart', armClickAwayListener, true);
      activatedRef.current = false;
    };
  }, [active]); // The handler doesn't take event.defaultPrevented into account:
  //
  // event.preventDefault() is meant to stop default behaviors like
  // clicking a checkbox to check it, hitting a button to submit a form,
  // and hitting left arrow to move the cursor in a text input etc.
  // Only special HTML elements have these default behaviors.

  const handleClickAway = useEventCallback(event => {
    if (!activatedRef.current) {
      return;
    } // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.


    const insideReactTree = syntheticEventRef.current;
    syntheticEventRef.current = false;
    const doc = ownerDocument(nodeRef.current); // 1. IE11 support, which trigger the handleClickAway even after the unbind
    // 2. The child might render null.
    // 3. Behave like a blur listener.

    if (!nodeRef.current || // is a TouchEvent?
    'clientX' in event && clickedRootScrollbar(event, doc)) {
      return;
    } // Do not act if user performed touchmove


    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    let insideDOM; // If not enough, can use https://github.com/DieterHolvoet/event-propagation-path/blob/master/propagationPath.js

    if (event.composedPath) {
      insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
    } else {
      insideDOM = !doc.documentElement.contains(event.target) || nodeRef.current.contains(event.target);
    }

    if (!insideDOM && !insideReactTree) {
      onClickAway(event);
    }
  }); // Keep track of mouse/touch events that bubbled up through the portal.

  const handleSynthetic = () => {
    syntheticEventRef.current = true;
  };

  react.useEffect(() => {
    if (active) {
      const doc = ownerDocument(nodeRef.current);

      const handleTouchMove = () => {
        movedRef.current = true;
      };

      doc.addEventListener('touchstart', handleClickAway);
      doc.addEventListener('touchmove', handleTouchMove);
      return () => {
        doc.removeEventListener('touchstart', handleClickAway);
        doc.removeEventListener('touchmove', handleTouchMove);
      };
    }

    return undefined;
  }, [active, handleClickAway]);
  react.useEffect(() => {
    // TODO This behavior is not tested automatically
    // It's unclear whether this is due to different update semantics in test (batched in act() vs discrete on click).
    // Or if this is a timing related issues due to different Transition components
    // Once we get rid of all the manual scheduling (e.g. setTimeout(update, 0)) we can revisit this code+test.
    if (active) {
      const doc = ownerDocument(nodeRef.current);
      doc.addEventListener('click', handleClickAway);
      return () => {
        doc.removeEventListener('click', handleClickAway); // cleanup `handleClickAway`

        syntheticEventRef.current = false;
      };
    }

    return undefined;
  }, [active, handleClickAway]);
  return [nodeRef, handleSynthetic, handleSynthetic];
}

const PickersPopper = props => {
  var _Button;

  const {
    anchorEl,
    children,
    containerRef = null,
    onClose,
    onClear,
    clearable = false,
    clearText = 'Clear',
    open,
    PopperProps,
    role,
    TransitionComponent = Grow,
    TrapFocusProps,
    PaperProps = {}
  } = props;
  react.useEffect(() => {
    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  const lastFocusedElementRef = react.useRef(null);
  react.useEffect(() => {
    if (role === 'tooltip') {
      return;
    }

    if (open) {
      lastFocusedElementRef.current = document.activeElement;
    } else if (lastFocusedElementRef.current && lastFocusedElementRef.current instanceof HTMLElement) {
      lastFocusedElementRef.current.focus();
    }
  }, [open, role]);
  const [clickAwayRef, onPaperClick, onPaperTouchStart] = useClickAwayListener(open, onClose);
  const paperRef = react.useRef(null);
  const handleRef = useForkRef(paperRef, containerRef);
  const handlePaperRef = useForkRef(handleRef, clickAwayRef);
  const ownerState = props;

  const {
    onClick: onPaperClickProp,
    onTouchStart: onPaperTouchStartProp
  } = PaperProps,
        otherPaperProps = _objectWithoutPropertiesLoose(PaperProps, _excluded$f);

  return /*#__PURE__*/jsxRuntime.jsx(PickersPopperRoot, _extends({
    transition: true,
    role: role,
    open: open,
    anchorEl: anchorEl,
    ownerState: ownerState
  }, PopperProps, {
    children: ({
      TransitionProps,
      placement
    }) => /*#__PURE__*/jsxRuntime.jsx(Unstable_TrapFocus, _extends({
      open: open,
      disableAutoFocus: true,
      disableEnforceFocus: role === 'tooltip',
      isEnabled: () => true
    }, TrapFocusProps, {
      children: /*#__PURE__*/jsxRuntime.jsx(TransitionComponent, _extends({}, TransitionProps, {
        children: /*#__PURE__*/jsxRuntime.jsxs(PickersPopperPaper, _extends({
          tabIndex: -1,
          elevation: 8,
          ref: handlePaperRef,
          onClick: event => {
            onPaperClick(event);

            if (onPaperClickProp) {
              onPaperClickProp(event);
            }
          },
          onTouchStart: event => {
            onPaperTouchStart(event);

            if (onPaperTouchStartProp) {
              onPaperTouchStartProp(event);
            }
          },
          ownerState: _extends({}, ownerState, {
            placement
          })
        }, otherPaperProps, {
          children: [children, /*#__PURE__*/jsxRuntime.jsx(PickersPopperAction, {
            ownerState: ownerState,
            children: clearable && (_Button || (_Button = /*#__PURE__*/jsxRuntime.jsx(__pika_web_default_export_for_treeshaking__$1, {
              onClick: onClear,
              children: clearText
            })))
          })]
        }))
      }))
    }))
  }));
};

var PickersPopper$1 = PickersPopper;

function DesktopWrapper(props) {
  const {
    children,
    DateInputProps,
    KeyboardDateInputComponent,
    onDismiss,
    open,
    PopperProps,
    PaperProps,
    TransitionComponent,
    onClear,
    clearText,
    clearable
  } = props;
  const ownInputRef = react.useRef(null);
  const inputRef = useForkRef(DateInputProps.inputRef, ownInputRef);
  return /*#__PURE__*/jsxRuntime.jsxs(WrapperVariantContext.Provider, {
    value: "desktop",
    children: [/*#__PURE__*/jsxRuntime.jsx(KeyboardDateInputComponent, _extends({}, DateInputProps, {
      inputRef: inputRef
    })), /*#__PURE__*/jsxRuntime.jsx(PickersPopper$1, {
      role: "dialog",
      open: open,
      anchorEl: ownInputRef.current,
      TransitionComponent: TransitionComponent,
      PopperProps: PopperProps,
      PaperProps: PaperProps,
      onClose: onDismiss,
      onClear: onClear,
      clearText: clearText,
      clearable: clearable,
      children: children
    })]
  });
}

/* Use it instead of .includes method for IE support */
function arrayIncludes(array, itemOrItems) {
  if (Array.isArray(itemOrItems)) {
    return itemOrItems.every(item => array.indexOf(item) !== -1);
  }

  return array.indexOf(itemOrItems) !== -1;
}
const onSpaceOrEnter = (innerFn, onFocus) => event => {
  if (event.key === 'Enter' || event.key === ' ') {
    innerFn(); // prevent any side effects

    event.preventDefault();
    event.stopPropagation();
  }

  if (onFocus) {
    onFocus(event);
  }
};
/* Quick untyped helper to improve function composition readability */

const pipe = (...fns) => fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)), value => value);
function createDelegatedEventHandler(fn, onEvent) {
  return event => {
    fn(event);

    if (onEvent) {
      onEvent(event);
    }
  };
}

function useViews({
  onChange,
  onViewChange,
  openTo,
  view,
  views
}) {
  var _views, _views2;

  const [openView, setOpenView] = useControlled({
    name: 'Picker',
    state: 'view',
    controlled: view,
    default: openTo && arrayIncludes(views, openTo) ? openTo : views[0]
  });
  const previousView = (_views = views[views.indexOf(openView) - 1]) != null ? _views : null;
  const nextView = (_views2 = views[views.indexOf(openView) + 1]) != null ? _views2 : null;
  const changeView = react.useCallback(newView => {
    setOpenView(newView);

    if (onViewChange) {
      onViewChange(newView);
    }
  }, [setOpenView, onViewChange]);
  const openNext = react.useCallback(() => {
    if (nextView) {
      changeView(nextView);
    }
  }, [nextView, changeView]);
  const handleChangeAndOpenNext = react.useCallback((date, currentViewSelectionState) => {
    const isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
    const globalSelectionState = isSelectionFinishedOnCurrentView && Boolean(nextView) ? 'partial' : currentViewSelectionState;
    onChange(date, globalSelectionState);

    if (isSelectionFinishedOnCurrentView) {
      openNext();
    }
  }, [nextView, onChange, openNext]);
  return {
    handleChangeAndOpenNext,
    nextView,
    previousView,
    openNext,
    openView,
    setOpenView: changeView
  };
}

const CLOCK_WIDTH = 220;
const CLOCK_HOUR_WIDTH = 36;
const clockCenter = {
  x: CLOCK_WIDTH / 2,
  y: CLOCK_WIDTH / 2
};
const baseClockPoint = {
  x: clockCenter.x,
  y: 0
};
const cx = baseClockPoint.x - clockCenter.x;
const cy = baseClockPoint.y - clockCenter.y;

const rad2deg = rad => rad * (180 / Math.PI);

const getAngleValue = (step, offsetX, offsetY) => {
  const x = offsetX - clockCenter.x;
  const y = offsetY - clockCenter.y;
  const atan = Math.atan2(cx, cy) - Math.atan2(x, y);
  let deg = rad2deg(atan);
  deg = Math.round(deg / step) * step;
  deg %= 360;
  const value = Math.floor(deg / step) || 0;
  const delta = x ** 2 + y ** 2;
  const distance = Math.sqrt(delta);
  return {
    value,
    distance
  };
};

const getMinutes = (offsetX, offsetY, step = 1) => {
  const angleStep = step * 6;
  let {
    value
  } = getAngleValue(angleStep, offsetX, offsetY);
  value = value * step % 60;
  return value;
};
const getHours = (offsetX, offsetY, ampm) => {
  const {
    value,
    distance
  } = getAngleValue(30, offsetX, offsetY);
  let hour = value || 12;

  if (!ampm) {
    if (distance < CLOCK_WIDTH / 2 - CLOCK_HOUR_WIDTH) {
      hour += 12;
      hour %= 24;
    }
  } else {
    hour %= 12;
  }

  return hour;
};

const _excluded$e = ["className", "hasSelected", "isInner", "type", "value"];
const ClockPointerRoot = styled('div')(({
  theme,
  ownerState
}) => _extends({
  width: 2,
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  left: 'calc(50% - 1px)',
  bottom: '50%',
  transformOrigin: 'center bottom 0px'
}, ownerState.toAnimateTransform && {
  transition: theme.transitions.create(['transform', 'height'])
}));
const ClockPointerThumb = styled('div')(({
  theme,
  ownerState
}) => _extends({
  width: 4,
  height: 4,
  backgroundColor: theme.palette.primary.contrastText,
  borderRadius: '50%',
  position: 'absolute',
  top: -21,
  left: `calc(50% - ${CLOCK_HOUR_WIDTH / 2}px)`,
  border: `${(CLOCK_HOUR_WIDTH - 4) / 2}px solid ${theme.palette.primary.main}`,
  boxSizing: 'content-box'
}, ownerState.hasSelected && {
  backgroundColor: theme.palette.primary.main
}));
/**
 * @ignore - internal component.
 */

class ClockPointer extends react.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      toAnimateTransform: false,
      previousType: undefined
    };
  }

  render() {
    const _this$props = this.props,
          {
      className,
      isInner,
      type,
      value
    } = _this$props,
          other = _objectWithoutPropertiesLoose(_this$props, _excluded$e);

    const ownerState = _extends({}, this.props, this.state);

    const getAngleStyle = () => {
      const max = type === 'hours' ? 12 : 60;
      let angle = 360 / max * value;

      if (type === 'hours' && value > 12) {
        angle -= 360; // round up angle to max 360 degrees
      }

      return {
        height: Math.round((isInner ? 0.26 : 0.4) * CLOCK_WIDTH),
        transform: `rotateZ(${angle}deg)`
      };
    };

    return /*#__PURE__*/jsxRuntime.jsx(ClockPointerRoot, _extends({
      style: getAngleStyle(),
      className: className,
      ownerState: ownerState
    }, other, {
      children: /*#__PURE__*/jsxRuntime.jsx(ClockPointerThumb, {
        ownerState: ownerState
      })
    }));
  }

}

ClockPointer.getDerivedStateFromProps = (nextProps, state) => {
  if (nextProps.type !== state.previousType) {
    return {
      toAnimateTransform: true,
      previousType: nextProps.type
    };
  }

  return {
    toAnimateTransform: false,
    previousType: nextProps.type
  };
};

var ClockPointer$1 = ClockPointer;

var _ClockPin, _Typography, _Typography2;
const ClockRoot = styled('div')(({
  theme
}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2)
}));
const ClockClock = styled('div')({
  backgroundColor: 'rgba(0,0,0,.07)',
  borderRadius: '50%',
  height: 220,
  width: 220,
  flexShrink: 0,
  position: 'relative',
  pointerEvents: 'none'
});
const ClockSquareMask = styled('div')({
  width: '100%',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'auto',
  outline: 0,
  // Disable scroll capabilities.
  touchAction: 'none',
  userSelect: 'none',
  '@media (pointer: fine)': {
    cursor: 'pointer',
    borderRadius: '50%'
  },
  '&:active': {
    cursor: 'move'
  }
});
const ClockPin = styled('div')(({
  theme
}) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}));
const ClockAmButton = styled(IconButton)(({
  theme,
  ownerState
}) => _extends({
  zIndex: 1,
  position: 'absolute',
  bottom: ownerState.ampmInClock ? 64 : 8,
  left: 8
}, ownerState.meridiemMode === 'am' && {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.light
  }
}));
const ClockPmButton = styled(IconButton)(({
  theme,
  ownerState
}) => _extends({
  zIndex: 1,
  position: 'absolute',
  bottom: ownerState.ampmInClock ? 64 : 8,
  right: 8
}, ownerState.meridiemMode === 'pm' && {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.light
  }
}));
/**
 * @ignore - internal component.
 */

function Clock(props) {
  const {
    ampm,
    ampmInClock,
    autoFocus,
    children,
    date,
    getClockLabelText,
    handleMeridiemChange,
    isTimeDisabled,
    meridiemMode,
    minutesStep = 1,
    onChange,
    selectedId,
    type,
    value
  } = props;
  const ownerState = props;
  const utils = useUtils();
  const wrapperVariant = react.useContext(WrapperVariantContext);
  const isMoving = react.useRef(false);
  const isSelectedTimeDisabled = isTimeDisabled(value, type);
  const isPointerInner = !ampm && type === 'hours' && (value < 1 || value > 12);

  const handleValueChange = (newValue, isFinish) => {
    if (isTimeDisabled(newValue, type)) {
      return;
    }

    onChange(newValue, isFinish);
  };

  const setTime = (event, isFinish) => {
    let {
      offsetX,
      offsetY
    } = event;

    if (offsetX === undefined) {
      const rect = event.target.getBoundingClientRect();
      offsetX = event.changedTouches[0].clientX - rect.left;
      offsetY = event.changedTouches[0].clientY - rect.top;
    }

    const newSelectedValue = type === 'seconds' || type === 'minutes' ? getMinutes(offsetX, offsetY, minutesStep) : getHours(offsetX, offsetY, Boolean(ampm));
    handleValueChange(newSelectedValue, isFinish);
  };

  const handleTouchMove = event => {
    isMoving.current = true;
    setTime(event, 'shallow');
  };

  const handleTouchEnd = event => {
    if (isMoving.current) {
      setTime(event, 'finish');
      isMoving.current = false;
    }
  };

  const handleMouseMove = event => {
    // event.buttons & PRIMARY_MOUSE_BUTTON
    if (event.buttons > 0) {
      setTime(event.nativeEvent, 'shallow');
    }
  };

  const handleMouseUp = event => {
    if (isMoving.current) {
      isMoving.current = false;
    }

    setTime(event.nativeEvent, 'finish');
  };

  const hasSelected = react.useMemo(() => {
    if (type === 'hours') {
      return true;
    }

    return value % 5 === 0;
  }, [type, value]);
  const keyboardControlStep = type === 'minutes' ? minutesStep : 1;
  const listboxRef = react.useRef(null); // Since this is rendered when a Popper is opened we can't use passive effects.
  // Focusing in passive effects in Popper causes scroll jump.

  useEnhancedEffect(() => {
    if (autoFocus) {
      // The ref not being resolved would be a bug in MUI.
      listboxRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = event => {
    // TODO: Why this early exit?
    if (isMoving.current) {
      return;
    }

    switch (event.key) {
      case 'Home':
        // annulate both hours and minutes
        handleValueChange(0, 'partial');
        event.preventDefault();
        break;

      case 'End':
        handleValueChange(type === 'minutes' ? 59 : 23, 'partial');
        event.preventDefault();
        break;

      case 'ArrowUp':
        handleValueChange(value + keyboardControlStep, 'partial');
        event.preventDefault();
        break;

      case 'ArrowDown':
        handleValueChange(value - keyboardControlStep, 'partial');
        event.preventDefault();
        break;

    }
  };

  return /*#__PURE__*/jsxRuntime.jsxs(ClockRoot, {
    children: [/*#__PURE__*/jsxRuntime.jsxs(ClockClock, {
      children: [/*#__PURE__*/jsxRuntime.jsx(ClockSquareMask, {
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove
      }), !isSelectedTimeDisabled && /*#__PURE__*/jsxRuntime.jsxs(react.Fragment, {
        children: [_ClockPin || (_ClockPin = /*#__PURE__*/jsxRuntime.jsx(ClockPin, {})), date && /*#__PURE__*/jsxRuntime.jsx(ClockPointer$1, {
          type: type,
          value: value,
          isInner: isPointerInner,
          hasSelected: hasSelected
        })]
      }), /*#__PURE__*/jsxRuntime.jsx("div", {
        "aria-activedescendant": selectedId,
        "aria-label": getClockLabelText(type, date, utils),
        ref: listboxRef,
        role: "listbox",
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        children: children
      })]
    }), ampm && (wrapperVariant === 'desktop' || ampmInClock) && /*#__PURE__*/jsxRuntime.jsxs(react.Fragment, {
      children: [/*#__PURE__*/jsxRuntime.jsx(ClockAmButton, {
        onClick: () => handleMeridiemChange('am'),
        disabled: meridiemMode === null,
        ownerState: ownerState,
        children: _Typography || (_Typography = /*#__PURE__*/jsxRuntime.jsx(Typography, {
          variant: "caption",
          children: "AM"
        }))
      }), /*#__PURE__*/jsxRuntime.jsx(ClockPmButton, {
        disabled: meridiemMode === null,
        onClick: () => handleMeridiemChange('pm'),
        ownerState: ownerState,
        children: _Typography2 || (_Typography2 = /*#__PURE__*/jsxRuntime.jsx(Typography, {
          variant: "caption",
          children: "PM"
        }))
      })]
    })]
  });
}

const _excluded$d = ["className", "disabled", "index", "inner", "label", "selected"];
const classes$3 = generateUtilityClasses('PrivateClockNumber', ['selected', 'disabled']);
const ClockNumberRoot = styled('span')(({
  theme,
  ownerState
}) => _extends({
  height: CLOCK_HOUR_WIDTH,
  width: CLOCK_HOUR_WIDTH,
  position: 'absolute',
  left: `calc((100% - ${CLOCK_HOUR_WIDTH}px) / 2)`,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '&:focused': {
    backgroundColor: theme.palette.background.paper
  },
  [`&.${classes$3.selected}`]: {
    color: theme.palette.primary.contrastText
  },
  [`&.${classes$3.disabled}`]: {
    pointerEvents: 'none',
    color: theme.palette.text.disabled
  }
}, ownerState.inner && _extends({}, theme.typography.body2, {
  color: theme.palette.text.secondary
})));
/**
 * @ignore - internal component.
 */

function ClockNumber(props) {
  const {
    className,
    disabled,
    index,
    inner,
    label,
    selected
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$d);

  const ownerState = props;
  const angle = index % 12 / 12 * Math.PI * 2 - Math.PI / 2;
  const length = (CLOCK_WIDTH - CLOCK_HOUR_WIDTH - 2) / 2 * (inner ? 0.65 : 1);
  const x = Math.round(Math.cos(angle) * length);
  const y = Math.round(Math.sin(angle) * length);
  return /*#__PURE__*/jsxRuntime.jsx(ClockNumberRoot, _extends({
    className: clsx(className, selected && classes$3.selected, disabled && classes$3.disabled),
    "aria-disabled": disabled ? true : undefined,
    "aria-selected": selected ? true : undefined,
    role: "option",
    style: {
      transform: `translate(${x}px, ${y + (CLOCK_WIDTH - CLOCK_HOUR_WIDTH) / 2}px`
    },
    ownerState: ownerState
  }, other, {
    children: label
  }));
}

/**
 * @ignore - internal component.
 */
const getHourNumbers = ({
  ampm,
  date,
  getClockNumberText,
  isDisabled,
  selectedId,
  utils
}) => {
  const currentHours = date ? utils.getHours(date) : null;
  const hourNumbers = [];
  const startHour = ampm ? 1 : 0;
  const endHour = ampm ? 12 : 23;

  const isSelected = hour => {
    if (currentHours === null) {
      return false;
    }

    if (ampm) {
      if (hour === 12) {
        return currentHours === 12 || currentHours === 0;
      }

      return currentHours === hour || currentHours - 12 === hour;
    }

    return currentHours === hour;
  };

  for (let hour = startHour; hour <= endHour; hour += 1) {
    let label = hour.toString();

    if (hour === 0) {
      label = '00';
    }

    const inner = !ampm && (hour === 0 || hour > 12);
    label = utils.formatNumber(label);
    const selected = isSelected(hour);
    hourNumbers.push( /*#__PURE__*/jsxRuntime.jsx(ClockNumber, {
      id: selected ? selectedId : undefined,
      index: hour,
      inner: inner,
      selected: selected,
      disabled: isDisabled(hour),
      label: label,
      "aria-label": getClockNumberText(label)
    }, hour));
  }

  return hourNumbers;
};
const getMinutesNumbers = ({
  utils,
  value,
  isDisabled,
  getClockNumberText,
  selectedId
}) => {
  const f = utils.formatNumber;
  return [[5, f('05')], [10, f('10')], [15, f('15')], [20, f('20')], [25, f('25')], [30, f('30')], [35, f('35')], [40, f('40')], [45, f('45')], [50, f('50')], [55, f('55')], [0, f('00')]].map(([numberValue, label], index) => {
    const selected = numberValue === value;
    return /*#__PURE__*/jsxRuntime.jsx(ClockNumber, {
      label: label,
      id: selected ? selectedId : undefined,
      index: index + 1,
      inner: false,
      disabled: isDisabled(numberValue),
      selected: selected,
      "aria-label": getClockNumberText(label)
    }, numberValue);
  });
};

var ArrowLeftIcon = createSvgIcon( /*#__PURE__*/jsxRuntime.jsx("path", {
  d: "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
}), 'ArrowLeft');

var ArrowRightIcon = createSvgIcon( /*#__PURE__*/jsxRuntime.jsx("path", {
  d: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
}), 'ArrowRight');

const _excluded$c = ["children", "className", "components", "componentsProps", "isLeftDisabled", "isLeftHidden", "isRightDisabled", "isRightHidden", "leftArrowButtonText", "onLeftClick", "onRightClick", "rightArrowButtonText"];
const PickersArrowSwitcherRoot = styled('div')({
  display: 'flex'
});
const PickersArrowSwitcherSpacer = styled('div')(({
  theme
}) => ({
  width: theme.spacing(3)
}));
const PickersArrowSwitcherButton = styled(IconButton)(({
  ownerState
}) => _extends({}, ownerState.hidden && {
  visibility: 'hidden'
}));
const PickersArrowSwitcher = /*#__PURE__*/react.forwardRef(function PickersArrowSwitcher(props, ref) {
  const {
    children,
    className,
    components = {},
    componentsProps = {},
    isLeftDisabled,
    isLeftHidden,
    isRightDisabled,
    isRightHidden,
    leftArrowButtonText,
    onLeftClick,
    onRightClick,
    rightArrowButtonText
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$c);

  const theme = useTheme$1();
  const isRtl = theme.direction === 'rtl';
  const leftArrowButtonProps = componentsProps.leftArrowButton || {};
  const LeftArrowIcon = components.LeftArrowIcon || ArrowLeftIcon;
  const rightArrowButtonProps = componentsProps.rightArrowButton || {};
  const RightArrowIcon = components.RightArrowIcon || ArrowRightIcon;
  const ownerState = props;
  return /*#__PURE__*/jsxRuntime.jsxs(PickersArrowSwitcherRoot, _extends({
    ref: ref,
    className: className,
    ownerState: ownerState
  }, other, {
    children: [/*#__PURE__*/jsxRuntime.jsx(PickersArrowSwitcherButton, _extends({
      as: components.LeftArrowButton,
      size: "small",
      "aria-label": leftArrowButtonText,
      title: leftArrowButtonText,
      disabled: isLeftDisabled,
      edge: "end",
      onClick: onLeftClick
    }, leftArrowButtonProps, {
      className: leftArrowButtonProps.className,
      ownerState: _extends({}, ownerState, leftArrowButtonProps, {
        hidden: isLeftHidden
      }),
      children: isRtl ? /*#__PURE__*/jsxRuntime.jsx(RightArrowIcon, {}) : /*#__PURE__*/jsxRuntime.jsx(LeftArrowIcon, {})
    })), children ? /*#__PURE__*/jsxRuntime.jsx(Typography, {
      variant: "subtitle1",
      component: "span",
      children: children
    }) : /*#__PURE__*/jsxRuntime.jsx(PickersArrowSwitcherSpacer, {
      ownerState: ownerState
    }), /*#__PURE__*/jsxRuntime.jsx(PickersArrowSwitcherButton, _extends({
      as: components.RightArrowButton,
      size: "small",
      "aria-label": rightArrowButtonText,
      title: rightArrowButtonText,
      edge: "start",
      disabled: isRightDisabled,
      onClick: onRightClick
    }, rightArrowButtonProps, {
      className: rightArrowButtonProps.className,
      ownerState: _extends({}, ownerState, rightArrowButtonProps, {
        hidden: isRightHidden
      }),
      children: isRtl ? /*#__PURE__*/jsxRuntime.jsx(LeftArrowIcon, {}) : /*#__PURE__*/jsxRuntime.jsx(RightArrowIcon, {})
    }))]
  }));
});
var PickersArrowSwitcher$1 = PickersArrowSwitcher;

const getMeridiem = (date, utils) => {
  if (!date) {
    return null;
  }

  return utils.getHours(date) >= 12 ? 'pm' : 'am';
};
const convertValueToMeridiem = (value, meridiem, ampm) => {
  if (ampm) {
    const currentMeridiem = value >= 12 ? 'pm' : 'am';

    if (currentMeridiem !== meridiem) {
      return meridiem === 'am' ? value - 12 : value + 12;
    }
  }

  return value;
};
const convertToMeridiem = (time, meridiem, ampm, utils) => {
  const newHoursAmount = convertValueToMeridiem(utils.getHours(time), meridiem, ampm);
  return utils.setHours(time, newHoursAmount);
};
function getSecondsInDay(date, utils) {
  return utils.getHours(date) * 3600 + utils.getMinutes(date) * 60 + utils.getSeconds(date);
}
const createIsAfterIgnoreDatePart = (disableIgnoringDatePartForTimeValidation, utils) => (dateLeft, dateRight) => {
  if (disableIgnoringDatePartForTimeValidation) {
    return utils.isAfter(dateLeft, dateRight);
  }

  return getSecondsInDay(dateLeft, utils) > getSecondsInDay(dateRight, utils);
};

function useNextMonthDisabled(month, {
  disableFuture,
  maxDate
}) {
  const utils = useUtils();
  return react.useMemo(() => {
    const now = utils.date();
    const lastEnabledMonth = utils.startOfMonth(disableFuture && utils.isBefore(now, maxDate) ? now : maxDate);
    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils]);
}
function usePreviousMonthDisabled(month, {
  disablePast,
  minDate
}) {
  const utils = useUtils();
  return react.useMemo(() => {
    const now = utils.date();
    const firstEnabledMonth = utils.startOfMonth(disablePast && utils.isAfter(now, minDate) ? now : minDate);
    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils]);
}
function useMeridiemMode(date, ampm, onChange) {
  const utils = useUtils();
  const meridiemMode = getMeridiem(date, utils);
  const handleMeridiemChange = react.useCallback(mode => {
    const timeWithMeridiem = convertToMeridiem(date, mode, Boolean(ampm), utils);
    onChange(timeWithMeridiem, 'partial');
  }, [ampm, date, onChange, utils]);
  return {
    meridiemMode,
    handleMeridiemChange
  };
}

function getClockPickerUtilityClass(slot) {
  return generateUtilityClass('MuiClockPicker', slot);
}
generateUtilityClasses('MuiClockPicker', ['arrowSwitcher']);

const useUtilityClasses$6 = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    arrowSwitcher: ['arrowSwitcher']
  };
  return composeClasses(slots, getClockPickerUtilityClass, classes);
};

const ClockPickerArrowSwitcher = styled(PickersArrowSwitcher$1, {
  name: 'MuiClockPicker',
  slot: 'ArrowSwitcher',
  overridesResolver: (props, styles) => styles.arrowSwitcher
})({
  position: 'absolute',
  right: 12,
  top: 15
});

const defaultGetClockLabelText = (view, time, adapter) => `Select ${view}. ${time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`}`;

const defaultGetMinutesClockNumberText = minutes => `${minutes} minutes`;

const defaultGetHoursClockNumberText = hours => `${hours} hours`;

const defaultGetSecondsClockNumberText = seconds => `${seconds} seconds`;
/**
 *
 * API:
 *
 * - [ClockPicker API](https://mui.com/api/clock-picker/)
 */


function ClockPicker(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiClockPicker'
  });
  const {
    ampm = false,
    ampmInClock = false,
    autoFocus,
    components,
    componentsProps,
    date,
    disableIgnoringDatePartForTimeValidation = false,
    getClockLabelText = defaultGetClockLabelText,
    getHoursClockNumberText = defaultGetHoursClockNumberText,
    getMinutesClockNumberText = defaultGetMinutesClockNumberText,
    getSecondsClockNumberText = defaultGetSecondsClockNumberText,
    leftArrowButtonText = 'open previous view',
    maxTime,
    minTime,
    minutesStep = 1,
    nextViewAvailable,
    onChange,
    openNextView,
    openPreviousView,
    previousViewAvailable,
    rightArrowButtonText = 'open next view',
    shouldDisableTime,
    showViewSwitcher,
    view
  } = props;
  const now = useNow();
  const utils = useUtils();
  const midnight = utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0);
  const dateOrMidnight = date || midnight;
  const {
    meridiemMode,
    handleMeridiemChange
  } = useMeridiemMode(dateOrMidnight, ampm, onChange);
  const isTimeDisabled = react.useCallback((rawValue, viewType) => {
    if (date === null) {
      return false;
    }

    const validateTimeValue = getRequestedTimePoint => {
      const isAfterComparingFn = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);
      return Boolean(minTime && isAfterComparingFn(minTime, getRequestedTimePoint('end')) || maxTime && isAfterComparingFn(getRequestedTimePoint('start'), maxTime) || shouldDisableTime && shouldDisableTime(rawValue, viewType));
    };

    switch (viewType) {
      case 'hours':
        {
          const hoursWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, ampm);
          return validateTimeValue(when => pipe(currentDate => utils.setHours(currentDate, hoursWithMeridiem), dateWithHours => utils.setMinutes(dateWithHours, when === 'start' ? 0 : 59), dateWithMinutes => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59))(date));
        }

      case 'minutes':
        return validateTimeValue(when => pipe(currentDate => utils.setMinutes(currentDate, rawValue), dateWithMinutes => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59))(date));

      case 'seconds':
        return validateTimeValue(() => utils.setSeconds(date, rawValue));

      default:
        throw new Error('not supported');
    }
  }, [ampm, date, disableIgnoringDatePartForTimeValidation, maxTime, meridiemMode, minTime, shouldDisableTime, utils]);
  const selectedId = useId();
  const viewProps = react.useMemo(() => {
    switch (view) {
      case 'hours':
        {
          const handleHoursChange = (value, isFinish) => {
            const valueWithMeridiem = convertValueToMeridiem(value, meridiemMode, ampm);
            onChange(utils.setHours(dateOrMidnight, valueWithMeridiem), isFinish);
          };

          return {
            onChange: handleHoursChange,
            value: utils.getHours(dateOrMidnight),
            children: getHourNumbers({
              date,
              utils,
              ampm,
              onChange: handleHoursChange,
              getClockNumberText: getHoursClockNumberText,
              isDisabled: value => isTimeDisabled(value, 'hours'),
              selectedId
            })
          };
        }

      case 'minutes':
        {
          const minutesValue = utils.getMinutes(dateOrMidnight);

          const handleMinutesChange = (value, isFinish) => {
            onChange(utils.setMinutes(dateOrMidnight, value), isFinish);
          };

          return {
            value: minutesValue,
            onChange: handleMinutesChange,
            children: getMinutesNumbers({
              utils,
              value: minutesValue,
              onChange: handleMinutesChange,
              getClockNumberText: getMinutesClockNumberText,
              isDisabled: value => isTimeDisabled(value, 'minutes'),
              selectedId
            })
          };
        }

      case 'seconds':
        {
          const secondsValue = utils.getSeconds(dateOrMidnight);

          const handleSecondsChange = (value, isFinish) => {
            onChange(utils.setSeconds(dateOrMidnight, value), isFinish);
          };

          return {
            value: secondsValue,
            onChange: handleSecondsChange,
            children: getMinutesNumbers({
              utils,
              value: secondsValue,
              onChange: handleSecondsChange,
              getClockNumberText: getSecondsClockNumberText,
              isDisabled: value => isTimeDisabled(value, 'seconds'),
              selectedId
            })
          };
        }

      default:
        throw new Error('You must provide the type for ClockView');
    }
  }, [view, utils, date, ampm, getHoursClockNumberText, getMinutesClockNumberText, getSecondsClockNumberText, meridiemMode, onChange, dateOrMidnight, isTimeDisabled, selectedId]);
  const ownerState = props;
  const classes = useUtilityClasses$6(ownerState);
  return /*#__PURE__*/jsxRuntime.jsxs(react.Fragment, {
    children: [showViewSwitcher && /*#__PURE__*/jsxRuntime.jsx(ClockPickerArrowSwitcher, {
      className: classes.arrowSwitcher,
      leftArrowButtonText: leftArrowButtonText,
      rightArrowButtonText: rightArrowButtonText,
      components: components,
      componentsProps: componentsProps,
      onLeftClick: openPreviousView,
      onRightClick: openNextView,
      isLeftDisabled: previousViewAvailable,
      isRightDisabled: nextViewAvailable,
      ownerState: ownerState
    }), /*#__PURE__*/jsxRuntime.jsx(Clock, _extends({
      autoFocus: autoFocus,
      date: date,
      ampmInClock: ampmInClock,
      type: view,
      ampm: ampm,
      getClockLabelText: getClockLabelText,
      minutesStep: minutesStep,
      isTimeDisabled: isTimeDisabled,
      meridiemMode: meridiemMode,
      handleMeridiemChange: handleMeridiemChange,
      selectedId: selectedId
    }, viewProps))]
  });
}

const _excluded$b = ["disabled", "onSelect", "selected", "value"];
const classes$2 = generateUtilityClasses('PrivatePickersMonth', ['root', 'selected']);
const PickersMonthRoot = styled(Typography)(({
  theme
}) => _extends({
  flex: '1 0 33.33%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0
}, theme.typography.subtitle1, {
  margin: '8px 0',
  height: 36,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus, &:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity)
  },
  '&:disabled': {
    pointerEvents: 'none',
    color: theme.palette.text.secondary
  },
  [`&.${classes$2.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}));
/**
 * @ignore - do not document.
 */

const PickersMonth = props => {
  const {
    disabled,
    onSelect,
    selected,
    value
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$b);

  const handleSelection = () => {
    onSelect(value);
  };

  return /*#__PURE__*/jsxRuntime.jsx(PickersMonthRoot, _extends({
    component: "button",
    className: clsx(classes$2.root, selected && classes$2.selected),
    tabIndex: disabled ? -1 : 0,
    onClick: handleSelection,
    onKeyDown: onSpaceOrEnter(handleSelection),
    color: selected ? 'primary' : undefined,
    variant: selected ? 'h5' : 'subtitle1',
    disabled: disabled
  }, other));
};

var PickersMonth$1 = PickersMonth;

const _excluded$a = ["className", "date", "disabled", "disableFuture", "disablePast", "maxDate", "minDate", "onChange", "onMonthChange", "readOnly"];
function getMonthPickerUtilityClass(slot) {
  return generateUtilityClass('MuiMonthPicker', slot);
}
generateUtilityClasses('MuiMonthPicker', ['root']);

const useUtilityClasses$5 = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root']
  };
  return composeClasses(slots, getMonthPickerUtilityClass, classes);
};

const MonthPickerRoot = styled('div', {
  name: 'MuiMonthPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  width: 310,
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  margin: '0 4px'
});
const MonthPicker = /*#__PURE__*/react.forwardRef(function MonthPicker(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiMonthPicker'
  });

  const {
    className,
    date,
    disabled,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onChange,
    onMonthChange,
    readOnly
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$a);

  const ownerState = props;
  const classes = useUtilityClasses$5(ownerState);
  const utils = useUtils();
  const now = useNow();
  const currentMonth = utils.getMonth(date || now);

  const shouldDisableMonth = month => {
    const firstEnabledMonth = utils.startOfMonth(disablePast && utils.isAfter(now, minDate) ? now : minDate);
    const lastEnabledMonth = utils.startOfMonth(disableFuture && utils.isBefore(now, maxDate) ? now : maxDate);
    const isBeforeFirstEnabled = utils.isBefore(month, firstEnabledMonth);
    const isAfterLastEnabled = utils.isAfter(month, lastEnabledMonth);
    return isBeforeFirstEnabled || isAfterLastEnabled;
  };

  const onMonthSelect = month => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setMonth(date || now, month);
    onChange(newDate, 'finish');

    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  return /*#__PURE__*/jsxRuntime.jsx(MonthPickerRoot, _extends({
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: utils.getMonthArray(date || now).map(month => {
      const monthNumber = utils.getMonth(month);
      const monthText = utils.format(month, 'monthShort');
      return /*#__PURE__*/jsxRuntime.jsx(PickersMonth$1, {
        value: monthNumber,
        selected: monthNumber === currentMonth,
        onSelect: onMonthSelect,
        disabled: disabled || shouldDisableMonth(month),
        children: monthText
      }, monthText);
    })
  }));
});
/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 *
 * API:
 *
 * - [MonthPicker API](https://mui.com/api/month-picker/)
 */

var MonthPicker$1 = MonthPicker;

const findClosestEnabledDate = ({
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  shouldDisableDate,
  utils
}) => {
  const today = utils.startOfDay(utils.date());

  if (disablePast && utils.isBefore(minDate, today)) {
    minDate = today;
  }

  if (disableFuture && utils.isAfter(maxDate, today)) {
    maxDate = today;
  }

  let forward = date;
  let backward = date;

  if (utils.isBefore(date, minDate)) {
    forward = utils.date(minDate);
    backward = null;
  }

  if (utils.isAfter(date, maxDate)) {
    if (backward) {
      backward = utils.date(maxDate);
    }

    forward = null;
  }

  while (forward || backward) {
    if (forward && utils.isAfter(forward, maxDate)) {
      forward = null;
    }

    if (backward && utils.isBefore(backward, minDate)) {
      backward = null;
    }

    if (forward) {
      if (!shouldDisableDate(forward)) {
        return forward;
      }

      forward = utils.addDays(forward, 1);
    }

    if (backward) {
      if (!shouldDisableDate(backward)) {
        return backward;
      }

      backward = utils.addDays(backward, -1);
    }
  }

  return today;
};
function parsePickerInputValue(utils, value) {
  const parsedValue = utils.date(value);
  return utils.isValid(parsedValue) ? parsedValue : null;
}
const validateDate = (utils, value, {
  disablePast,
  disableFuture,
  minDate,
  maxDate,
  shouldDisableDate
}) => {
  const now = utils.date();
  const date = utils.date(value);

  if (date === null) {
    return null;
  }

  switch (true) {
    case !utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate && shouldDisableDate(date)):
      return 'shouldDisableDate';

    case Boolean(disableFuture && utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && utils.isAfterDay(date, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};

const createCalendarStateReducer = (reduceAnimations, disableSwitchToMonthOnDayFocus, utils) => (state, action) => {
  switch (action.type) {
    case 'changeMonth':
      return _extends({}, state, {
        slideDirection: action.direction,
        currentMonth: action.newMonth,
        isMonthSwitchingAnimating: !reduceAnimations
      });

    case 'finishMonthSwitchingAnimation':
      return _extends({}, state, {
        isMonthSwitchingAnimating: false
      });

    case 'changeFocusedDay':
      {
        if (state.focusedDay !== null && utils.isSameDay(action.focusedDay, state.focusedDay)) {
          return state;
        }

        const needMonthSwitch = Boolean(action.focusedDay) && !disableSwitchToMonthOnDayFocus && !utils.isSameMonth(state.currentMonth, action.focusedDay);
        return _extends({}, state, {
          focusedDay: action.focusedDay,
          isMonthSwitchingAnimating: needMonthSwitch && !reduceAnimations,
          currentMonth: needMonthSwitch ? utils.startOfMonth(action.focusedDay) : state.currentMonth,
          slideDirection: utils.isAfterDay(action.focusedDay, state.currentMonth) ? 'left' : 'right'
        });
      }

    default:
      throw new Error('missing support');
  }
};
function useCalendarState({
  date,
  defaultCalendarMonth,
  disableFuture,
  disablePast,
  disableSwitchToMonthOnDayFocus = false,
  maxDate,
  minDate,
  onMonthChange,
  reduceAnimations,
  shouldDisableDate
}) {
  var _ref;

  const now = useNow();
  const utils = useUtils();
  const reducerFn = react.useRef(createCalendarStateReducer(Boolean(reduceAnimations), disableSwitchToMonthOnDayFocus, utils)).current;
  const [calendarState, dispatch] = react.useReducer(reducerFn, {
    isMonthSwitchingAnimating: false,
    focusedDay: date || now,
    currentMonth: utils.startOfMonth((_ref = date != null ? date : defaultCalendarMonth) != null ? _ref : now),
    slideDirection: 'left'
  });
  const handleChangeMonth = react.useCallback(payload => {
    dispatch(_extends({
      type: 'changeMonth'
    }, payload));

    if (onMonthChange) {
      onMonthChange(payload.newMonth);
    }
  }, [onMonthChange]);
  const changeMonth = react.useCallback(newDate => {
    const newDateRequested = newDate != null ? newDate : now;

    if (utils.isSameMonth(newDateRequested, calendarState.currentMonth)) {
      return;
    }

    handleChangeMonth({
      newMonth: utils.startOfMonth(newDateRequested),
      direction: utils.isAfterDay(newDateRequested, calendarState.currentMonth) ? 'left' : 'right'
    });
  }, [calendarState.currentMonth, handleChangeMonth, now, utils]);
  const isDateDisabled = react.useCallback(day => validateDate(utils, day, {
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    shouldDisableDate
  }) !== null, [disableFuture, disablePast, maxDate, minDate, shouldDisableDate, utils]);
  const onMonthSwitchingAnimationEnd = react.useCallback(() => {
    dispatch({
      type: 'finishMonthSwitchingAnimation'
    });
  }, []);
  const changeFocusedDay = react.useCallback(newFocusedDate => {
    if (!isDateDisabled(newFocusedDate)) {
      dispatch({
        type: 'changeFocusedDay',
        focusedDay: newFocusedDate
      });
    }
  }, [isDateDisabled]);
  return {
    calendarState,
    changeMonth,
    changeFocusedDay,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
    handleChangeMonth
  };
}

const classes$1 = generateUtilityClasses('PrivatePickersFadeTransitionGroup', ['root']);
const animationDuration = 500;
const PickersFadeTransitionGroupRoot = styled(TransitionGroup)({
  display: 'block',
  position: 'relative'
});
/**
 * @ignore - do not document.
 */

const PickersFadeTransitionGroup = ({
  children,
  className,
  reduceAnimations,
  transKey
}) => {
  if (reduceAnimations) {
    return children;
  }

  return /*#__PURE__*/jsxRuntime.jsx(PickersFadeTransitionGroupRoot, {
    className: clsx(classes$1.root, className),
    children: /*#__PURE__*/jsxRuntime.jsx(Fade, {
      appear: false,
      mountOnEnter: true,
      unmountOnExit: true,
      timeout: {
        appear: animationDuration,
        enter: animationDuration / 2,
        exit: 0
      },
      children: children
    }, transKey)
  });
};

var FadeTransitionGroup = PickersFadeTransitionGroup;

const DAY_SIZE = 36;
const DAY_MARGIN = 2;
const DIALOG_WIDTH = 320;
const VIEW_HEIGHT = 358;

const _excluded$9 = ["allowSameDateSelection", "autoFocus", "className", "day", "disabled", "disableHighlightToday", "disableMargin", "hidden", "isAnimating", "onClick", "onDayFocus", "onDaySelect", "onFocus", "onKeyDown", "outsideCurrentMonth", "selected", "showDaysOutsideCurrentMonth", "children", "today"];
function getPickersDayUtilityClass(slot) {
  return generateUtilityClass('MuiPickersDay', slot);
}
const pickersDayClasses = generateUtilityClasses('MuiPickersDay', ['root', 'dayWithMargin', 'dayOutsideMonth', 'hiddenDaySpacingFiller', 'today', 'selected', 'disabled']);

const useUtilityClasses$4 = ownerState => {
  const {
    selected,
    disableMargin,
    disableHighlightToday,
    today,
    outsideCurrentMonth,
    showDaysOutsideCurrentMonth,
    classes
  } = ownerState;
  const slots = {
    root: ['root', selected && 'selected', !disableMargin && 'dayWithMargin', !disableHighlightToday && today && 'today', outsideCurrentMonth && showDaysOutsideCurrentMonth && 'dayOutsideMonth'],
    hiddenDaySpacingFiller: ['hiddenDaySpacingFiller']
  };
  return composeClasses(slots, getPickersDayUtilityClass, classes);
};

const styleArg = ({
  theme,
  ownerState
}) => _extends({}, theme.typography.caption, {
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: '50%',
  padding: 0,
  // background required here to prevent collides with the other days when animating with transition group
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity)
  },
  '&:focus': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
    [`&.${pickersDayClasses.selected}`]: {
      willChange: 'background-color',
      backgroundColor: theme.palette.primary.dark
    }
  },
  [`&.${pickersDayClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      willChange: 'background-color',
      backgroundColor: theme.palette.primary.dark
    }
  },
  [`&.${pickersDayClasses.disabled}`]: {
    color: theme.palette.text.disabled
  }
}, !ownerState.disableMargin && {
  margin: `0 ${DAY_MARGIN}px`
}, ownerState.outsideCurrentMonth && ownerState.showDaysOutsideCurrentMonth && {
  color: theme.palette.text.secondary
}, !ownerState.disableHighlightToday && ownerState.today && {
  [`&:not(.${pickersDayClasses.selected})`]: {
    border: `1px solid ${theme.palette.text.secondary}`
  }
});

const overridesResolver = (props, styles) => {
  const {
    ownerState
  } = props;
  return [styles.root, !ownerState.disableMargin && styles.dayWithMargin, !ownerState.disableHighlightToday && ownerState.today && styles.today, !ownerState.outsideCurrentMonth && ownerState.showDaysOutsideCurrentMonth && styles.dayOutsideMonth, ownerState.outsideCurrentMonth && !ownerState.showDaysOutsideCurrentMonth && styles.hiddenDaySpacingFiller];
};

const PickersDayRoot = styled(ButtonBase, {
  name: 'MuiPickersDay',
  slot: 'Root',
  overridesResolver
})(styleArg);
const PickersDayFiller = styled('div', {
  name: 'MuiPickersDay',
  slot: 'Root',
  overridesResolver
})(({
  theme,
  ownerState
}) => _extends({}, styleArg({
  theme,
  ownerState
}), {
  visibility: 'hidden'
}));

const noop = () => {};

const PickersDay = /*#__PURE__*/react.forwardRef(function PickersDay(inProps, forwardedRef) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersDay'
  });

  const {
    allowSameDateSelection = false,
    autoFocus = false,
    className,
    day,
    disabled = false,
    disableHighlightToday = false,
    disableMargin = false,
    isAnimating,
    onClick,
    onDayFocus = noop,
    onDaySelect,
    onFocus,
    onKeyDown,
    outsideCurrentMonth,
    selected = false,
    showDaysOutsideCurrentMonth = false,
    children,
    today: isToday = false
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$9);

  const ownerState = _extends({}, props, {
    allowSameDateSelection,
    autoFocus,
    disabled,
    disableHighlightToday,
    disableMargin,
    selected,
    showDaysOutsideCurrentMonth,
    today: isToday
  });

  const classes = useUtilityClasses$4(ownerState);
  const utils = useUtils();
  const ref = react.useRef(null);
  const handleRef = useForkRef(ref, forwardedRef); // Since this is rendered when a Popper is opened we can't use passive effects.
  // Focusing in passive effects in Popper causes scroll jump.

  useEnhancedEffect(() => {
    if (autoFocus && !disabled && !isAnimating && !outsideCurrentMonth) {
      // ref.current being null would be a bug in MUI
      ref.current.focus();
    }
  }, [autoFocus, disabled, isAnimating, outsideCurrentMonth]);

  const handleFocus = event => {
    if (onDayFocus) {
      onDayFocus(day);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleClick = event => {
    if (!allowSameDateSelection && selected) {
      return;
    }

    if (!disabled) {
      onDaySelect(day, 'finish');
    }

    if (onClick) {
      onClick(event);
    }
  };

  const theme = useTheme$1();

  function handleKeyDown(event) {
    if (onKeyDown !== undefined) {
      onKeyDown(event);
    }

    switch (event.key) {
      case 'ArrowUp':
        onDayFocus(utils.addDays(day, -7));
        event.preventDefault();
        break;

      case 'ArrowDown':
        onDayFocus(utils.addDays(day, 7));
        event.preventDefault();
        break;

      case 'ArrowLeft':
        onDayFocus(utils.addDays(day, theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;

      case 'ArrowRight':
        onDayFocus(utils.addDays(day, theme.direction === 'ltr' ? 1 : -1));
        event.preventDefault();
        break;

      case 'Home':
        onDayFocus(utils.startOfWeek(day));
        event.preventDefault();
        break;

      case 'End':
        onDayFocus(utils.endOfWeek(day));
        event.preventDefault();
        break;

      case 'PageUp':
        onDayFocus(utils.getNextMonth(day));
        event.preventDefault();
        break;

      case 'PageDown':
        onDayFocus(utils.getPreviousMonth(day));
        event.preventDefault();
        break;
    }
  }

  if (outsideCurrentMonth && !showDaysOutsideCurrentMonth) {
    return /*#__PURE__*/jsxRuntime.jsx(PickersDayFiller, {
      className: clsx(classes.root, classes.hiddenDaySpacingFiller, className),
      ownerState: ownerState
    });
  }

  return /*#__PURE__*/jsxRuntime.jsx(PickersDayRoot, _extends({
    className: clsx(classes.root, className),
    ownerState: ownerState,
    ref: handleRef,
    centerRipple: true,
    disabled: disabled,
    "aria-label": !children ? utils.format(day, 'fullDate') : undefined,
    tabIndex: selected ? 0 : -1,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onClick: handleClick
  }, other, {
    children: !children ? utils.format(day, 'dayOfMonth') : children
  }));
});
const areDayPropsEqual = (prevProps, nextProps) => {
  return prevProps.autoFocus === nextProps.autoFocus && prevProps.isAnimating === nextProps.isAnimating && prevProps.today === nextProps.today && prevProps.disabled === nextProps.disabled && prevProps.selected === nextProps.selected && prevProps.disableMargin === nextProps.disableMargin && prevProps.showDaysOutsideCurrentMonth === nextProps.showDaysOutsideCurrentMonth && prevProps.disableHighlightToday === nextProps.disableHighlightToday && prevProps.className === nextProps.className && prevProps.outsideCurrentMonth === nextProps.outsideCurrentMonth && prevProps.onDayFocus === nextProps.onDayFocus && prevProps.onDaySelect === nextProps.onDaySelect;
};
/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 *
 * API:
 *
 * - [PickersDay API](https://mui.com/api/pickers-day/)
 */

var PickersDay$1 = /*#__PURE__*/react.memo(PickersDay, areDayPropsEqual);

const _excluded$8 = ["children", "className", "reduceAnimations", "slideDirection", "transKey"];
const classes = generateUtilityClasses('PrivatePickersSlideTransition', ['root', 'slideEnter-left', 'slideEnter-right', 'slideEnterActive', 'slideEnterActive', 'slideExit', 'slideExitActiveLeft-left', 'slideExitActiveLeft-right']);
const slideAnimationDuration = 350;
const PickersSlideTransitionRoot = styled(TransitionGroup)(({
  theme
}) => {
  const slideTransition = theme.transitions.create('transform', {
    duration: slideAnimationDuration,
    easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)'
  });
  return {
    display: 'block',
    position: 'relative',
    overflowX: 'hidden',
    '& > *': {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0
    },
    [`& .${classes['slideEnter-left']}`]: {
      willChange: 'transform',
      transform: 'translate(100%)',
      zIndex: 1
    },
    [`& .${classes['slideEnter-right']}`]: {
      willChange: 'transform',
      transform: 'translate(-100%)',
      zIndex: 1
    },
    [`& .${classes.slideEnterActive}`]: {
      transform: 'translate(0%)',
      transition: slideTransition
    },
    [`& .${classes.slideExit}`]: {
      transform: 'translate(0%)'
    },
    [`& .${classes['slideExitActiveLeft-left']}`]: {
      willChange: 'transform',
      transform: 'translate(-100%)',
      transition: slideTransition,
      zIndex: 0
    },
    [`& .${classes['slideExitActiveLeft-right']}`]: {
      willChange: 'transform',
      transform: 'translate(100%)',
      transition: slideTransition,
      zIndex: 0
    }
  };
});
/**
 * @ignore - do not document.
 */

const PickersSlideTransition = _ref => {
  let {
    children,
    className,
    reduceAnimations,
    slideDirection,
    transKey
  } = _ref,
      other = _objectWithoutPropertiesLoose(_ref, _excluded$8);

  if (reduceAnimations) {
    return /*#__PURE__*/jsxRuntime.jsx("div", {
      className: clsx(classes.root, className),
      children: children
    });
  }

  const transitionClasses = {
    exit: classes.slideExit,
    enterActive: classes.slideEnterActive,
    enter: classes[`slideEnter-${slideDirection}`],
    exitActive: classes[`slideExitActiveLeft-${slideDirection}`]
  };
  return /*#__PURE__*/jsxRuntime.jsx(PickersSlideTransitionRoot, {
    className: clsx(classes.root, className),
    childFactory: element => /*#__PURE__*/react.cloneElement(element, {
      classNames: transitionClasses
    }),
    children: /*#__PURE__*/jsxRuntime.jsx(CSSTransition, _extends({
      mountOnEnter: true,
      unmountOnExit: true,
      timeout: slideAnimationDuration,
      classNames: transitionClasses
    }, other, {
      children: children
    }), transKey)
  });
};

var SlideTransition = PickersSlideTransition;

var _span$1;
const weeksContainerHeight = (DAY_SIZE + DAY_MARGIN * 4) * 6;
const PickersCalendarDayHeader = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});
const PickersCalendarWeekDayLabel = styled(Typography)(({
  theme
}) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary
}));
const PickersCalendarLoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: weeksContainerHeight
});
const PickersCalendarSlideTransition = styled(SlideTransition)({
  minHeight: weeksContainerHeight
});
const PickersCalendarWeekContainer = styled('div')({
  overflow: 'hidden'
});
const PickersCalendarWeek = styled('div')({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center'
});
/**
 * @ignore - do not document.
 */

function PickersCalendar(props) {
  const {
    allowSameDateSelection,
    autoFocus,
    onFocusedDayChange: changeFocusedDay,
    className,
    currentMonth,
    date,
    disabled,
    disableHighlightToday,
    focusedDay,
    isDateDisabled,
    isMonthSwitchingAnimating,
    loading,
    onChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderDay,
    renderLoading = () => _span$1 || (_span$1 = /*#__PURE__*/jsxRuntime.jsx("span", {
      children: "..."
    })),
    showDaysOutsideCurrentMonth,
    slideDirection,
    TransitionProps
  } = props;
  const now = useNow();
  const utils = useUtils();
  const handleDaySelect = react.useCallback((day, isFinish = 'finish') => {
    if (readOnly) {
      return;
    } // TODO possibly buggy line figure out and add tests


    const finalDate = Array.isArray(date) ? day : utils.mergeDateAndTime(day, date || now);
    onChange(finalDate, isFinish);
  }, [date, now, onChange, readOnly, utils]);
  const currentMonthNumber = utils.getMonth(currentMonth);
  const selectedDates = (Array.isArray(date) ? date : [date]).filter(Boolean).map(selectedDateItem => selectedDateItem && utils.startOfDay(selectedDateItem)); // need a new ref whenever the `key` of the transition changes: http://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.

  const transitionKey = currentMonthNumber; // eslint-disable-next-line react-hooks/exhaustive-deps

  const slideNodeRef = react.useMemo(() => /*#__PURE__*/react.createRef(), [transitionKey]);
  return /*#__PURE__*/jsxRuntime.jsxs(react.Fragment, {
    children: [/*#__PURE__*/jsxRuntime.jsx(PickersCalendarDayHeader, {
      children: utils.getWeekdays().map((day, i) => /*#__PURE__*/jsxRuntime.jsx(PickersCalendarWeekDayLabel, {
        "aria-hidden": true,
        variant: "caption",
        children: day.charAt(0).toUpperCase()
      }, day + i.toString()))
    }), loading ? /*#__PURE__*/jsxRuntime.jsx(PickersCalendarLoadingContainer, {
      children: renderLoading()
    }) : /*#__PURE__*/jsxRuntime.jsx(PickersCalendarSlideTransition, _extends({
      transKey: transitionKey,
      onExited: onMonthSwitchingAnimationEnd,
      reduceAnimations: reduceAnimations,
      slideDirection: slideDirection,
      className: className
    }, TransitionProps, {
      nodeRef: slideNodeRef,
      children: /*#__PURE__*/jsxRuntime.jsx(PickersCalendarWeekContainer, {
        ref: slideNodeRef,
        role: "grid",
        children: utils.getWeekArray(currentMonth).map(week => /*#__PURE__*/jsxRuntime.jsx(PickersCalendarWeek, {
          role: "row",
          children: week.map(day => {
            const pickersDayProps = {
              key: day == null ? void 0 : day.toString(),
              day,
              isAnimating: isMonthSwitchingAnimating,
              disabled: disabled || isDateDisabled(day),
              allowSameDateSelection,
              autoFocus: autoFocus && focusedDay !== null && utils.isSameDay(day, focusedDay),
              today: utils.isSameDay(day, now),
              outsideCurrentMonth: utils.getMonth(day) !== currentMonthNumber,
              selected: selectedDates.some(selectedDate => selectedDate && utils.isSameDay(selectedDate, day)),
              disableHighlightToday,
              showDaysOutsideCurrentMonth,
              onDayFocus: changeFocusedDay,
              onDaySelect: handleDaySelect
            };
            return renderDay ? renderDay(day, selectedDates, pickersDayProps) : /*#__PURE__*/jsxRuntime.jsx("div", {
              role: "cell",
              children: /*#__PURE__*/jsxRuntime.jsx(PickersDay$1, _extends({}, pickersDayProps))
            }, pickersDayProps.key);
          })
        }, `week-${week[0]}`))
      })
    }))]
  });
}

var ArrowDropDownIcon = createSvgIcon( /*#__PURE__*/jsxRuntime.jsx("path", {
  d: "M7 10l5 5 5-5z"
}), 'ArrowDropDown');

const PickersCalendarHeaderRoot = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 8,
  paddingLeft: 24,
  paddingRight: 12,
  // prevent jumping in safari
  maxHeight: 30,
  minHeight: 30
});
const PickersCalendarHeaderLabel = styled('div')(({
  theme
}) => _extends({
  display: 'flex',
  maxHeight: 30,
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto'
}, theme.typography.body1, {
  fontWeight: theme.typography.fontWeightMedium
}));
const PickersCalendarHeaderLabelItem = styled('div')({
  marginRight: 6
});
const PickersCalendarHeaderSwitchViewButton = styled(IconButton)({
  marginRight: 'auto'
});
const PickersCalendarHeaderSwitchView = styled(ArrowDropDownIcon)(({
  theme,
  ownerState
}) => _extends({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)'
}, ownerState.openView === 'year' && {
  transform: 'rotate(180deg)'
}));

function getSwitchingViewAriaText(view) {
  return view === 'year' ? 'year view is open, switch to calendar view' : 'calendar view is open, switch to year view';
}
/**
 * @ignore - do not document.
 */


function PickersCalendarHeader(props) {
  const {
    components = {},
    componentsProps = {},
    currentMonth: month,
    disabled,
    disableFuture,
    disablePast,
    getViewSwitchingButtonText = getSwitchingViewAriaText,
    leftArrowButtonText = 'Previous month',
    maxDate,
    minDate,
    onMonthChange,
    onViewChange,
    openView: currentView,
    reduceAnimations,
    rightArrowButtonText = 'Next month',
    views
  } = props;
  const utils = useUtils();
  const switchViewButtonProps = componentsProps.switchViewButton || {};

  const selectNextMonth = () => onMonthChange(utils.getNextMonth(month), 'left');

  const selectPreviousMonth = () => onMonthChange(utils.getPreviousMonth(month), 'right');

  const isNextMonthDisabled = useNextMonthDisabled(month, {
    disableFuture: disableFuture || disabled,
    maxDate
  });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(month, {
    disablePast: disablePast || disabled,
    minDate
  });

  const handleToggleView = () => {
    if (views.length === 1 || !onViewChange || disabled) {
      return;
    }

    if (views.length === 2) {
      onViewChange(views.find(view => view !== currentView) || views[0]);
    } else {
      // switching only between first 2
      const nextIndexToOpen = views.indexOf(currentView) !== 0 ? 0 : 1;
      onViewChange(views[nextIndexToOpen]);
    }
  }; // No need to display more information


  if (views.length === 1 && views[0] === 'year') {
    return null;
  }

  const ownerState = props;
  return /*#__PURE__*/jsxRuntime.jsxs(PickersCalendarHeaderRoot, {
    ownerState: ownerState,
    children: [/*#__PURE__*/jsxRuntime.jsxs(PickersCalendarHeaderLabel, {
      role: "presentation",
      onClick: handleToggleView,
      ownerState: ownerState,
      children: [/*#__PURE__*/jsxRuntime.jsx(FadeTransitionGroup, {
        reduceAnimations: reduceAnimations,
        transKey: utils.format(month, 'month'),
        children: /*#__PURE__*/jsxRuntime.jsx(PickersCalendarHeaderLabelItem, {
          "aria-live": "polite",
          ownerState: ownerState,
          children: utils.format(month, 'month')
        })
      }), /*#__PURE__*/jsxRuntime.jsx(FadeTransitionGroup, {
        reduceAnimations: reduceAnimations,
        transKey: utils.format(month, 'year'),
        children: /*#__PURE__*/jsxRuntime.jsx(PickersCalendarHeaderLabelItem, {
          "aria-live": "polite",
          ownerState: ownerState,
          children: utils.format(month, 'year')
        })
      }), views.length > 1 && !disabled && /*#__PURE__*/jsxRuntime.jsx(PickersCalendarHeaderSwitchViewButton, _extends({
        size: "small",
        as: components.SwitchViewButton,
        "aria-label": getViewSwitchingButtonText(currentView)
      }, switchViewButtonProps, {
        children: /*#__PURE__*/jsxRuntime.jsx(PickersCalendarHeaderSwitchView, {
          as: components.SwitchViewIcon,
          ownerState: ownerState
        })
      }))]
    }), /*#__PURE__*/jsxRuntime.jsx(Fade, {
      in: currentView === 'day',
      children: /*#__PURE__*/jsxRuntime.jsx(PickersArrowSwitcher$1, {
        leftArrowButtonText: leftArrowButtonText,
        rightArrowButtonText: rightArrowButtonText,
        components: components,
        componentsProps: componentsProps,
        onLeftClick: selectPreviousMonth,
        onRightClick: selectNextMonth,
        isLeftDisabled: isPreviousMonthDisabled,
        isRightDisabled: isNextMonthDisabled
      })
    })]
  });
}

function getPickersYearUtilityClass(slot) {
  return generateUtilityClass('PrivatePickersYear', slot);
}
const pickersYearClasses = generateUtilityClasses('PrivatePickersYear', ['root', 'modeMobile', 'modeDesktop', 'yearButton', 'disabled', 'selected']);

const useUtilityClasses$3 = ownerState => {
  const {
    wrapperVariant,
    disabled,
    selected,
    classes
  } = ownerState;
  const slots = {
    root: ['root', wrapperVariant && `mode${capitalize(wrapperVariant)}`],
    yearButton: ['yearButton', disabled && 'disabled', selected && 'selected']
  };
  return composeClasses(slots, getPickersYearUtilityClass, classes);
};

const PickersYearRoot = styled('div')(({
  ownerState
}) => _extends({
  flexBasis: '33.3%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}, (ownerState == null ? void 0 : ownerState.wrapperVariant) === 'desktop' && {
  flexBasis: '25%'
}));
const PickersYearButton = styled('button')(({
  theme
}) => _extends({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0
}, theme.typography.subtitle1, {
  margin: '8px 0',
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus, &:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity)
  },
  [`&.${pickersYearClasses.disabled}`]: {
    color: theme.palette.text.secondary
  },
  [`&.${pickersYearClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}));
/**
 * @ignore - internal component.
 */

const PickersYear = /*#__PURE__*/react.forwardRef(function PickersYear(props, forwardedRef) {
  const {
    autoFocus,
    className,
    children,
    disabled,
    onClick,
    onKeyDown,
    selected,
    value
  } = props;
  const ref = react.useRef(null);
  const refHandle = useForkRef(ref, forwardedRef);
  const wrapperVariant = react.useContext(WrapperVariantContext);

  const ownerState = _extends({}, props, {
    wrapperVariant
  });

  const classes = useUtilityClasses$3(ownerState); // TODO: Can we just forward this to the button?

  react.useEffect(() => {
    if (autoFocus) {
      // `ref.current` being `null` would be a bug in MUIu
      ref.current.focus();
    }
  }, [autoFocus]);
  return /*#__PURE__*/jsxRuntime.jsx(PickersYearRoot, {
    className: clsx(classes.root, className),
    ownerState: ownerState,
    children: /*#__PURE__*/jsxRuntime.jsx(PickersYearButton, {
      ref: refHandle,
      disabled: disabled,
      type: "button",
      tabIndex: selected ? 0 : -1,
      onClick: event => onClick(event, value),
      onKeyDown: event => onKeyDown(event, value),
      className: classes.yearButton,
      ownerState: ownerState,
      children: children
    })
  });
});
var PickersYear$1 = PickersYear;

function getYearPickerUtilityClass(slot) {
  return generateUtilityClass('MuiYearPicker', slot);
}
generateUtilityClasses('MuiYearPicker', ['root']);

const useUtilityClasses$2 = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root']
  };
  return composeClasses(slots, getYearPickerUtilityClass, classes);
};

const YearPickerRoot = styled('div', {
  name: 'MuiYearPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflowY: 'auto',
  height: '100%',
  margin: '0 4px'
});
const YearPicker = /*#__PURE__*/react.forwardRef(function YearPicker(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiYearPicker'
  });
  const {
    autoFocus,
    className,
    date,
    disabled,
    disableFuture,
    disablePast,
    isDateDisabled,
    maxDate,
    minDate,
    onChange,
    onFocusedDayChange,
    onYearChange,
    readOnly,
    shouldDisableYear
  } = props;
  const ownerState = props;
  const classes = useUtilityClasses$2(ownerState);
  const now = useNow();
  const theme = useTheme$1();
  const utils = useUtils();
  const selectedDate = date || now;
  const currentYear = utils.getYear(selectedDate);
  const wrapperVariant = react.useContext(WrapperVariantContext);
  const selectedYearRef = react.useRef(null);
  const [focusedYear, setFocusedYear] = react.useState(currentYear);

  const handleYearSelection = (event, year, isFinish = 'finish') => {
    if (readOnly) {
      return;
    }

    const submitDate = newDate => {
      onChange(newDate, isFinish);

      if (onFocusedDayChange) {
        onFocusedDayChange(newDate || now);
      }

      if (onYearChange) {
        onYearChange(newDate);
      }
    };

    const newDate = utils.setYear(selectedDate, year);

    if (isDateDisabled(newDate)) {
      const closestEnabledDate = findClosestEnabledDate({
        utils,
        date: newDate,
        minDate,
        maxDate,
        disablePast: Boolean(disablePast),
        disableFuture: Boolean(disableFuture),
        shouldDisableDate: isDateDisabled
      });
      submitDate(closestEnabledDate || now);
    } else {
      submitDate(newDate);
    }
  };

  const focusYear = react.useCallback(year => {
    if (!isDateDisabled(utils.setYear(selectedDate, year))) {
      setFocusedYear(year);
    }
  }, [selectedDate, isDateDisabled, utils]);
  const yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;

  const handleKeyDown = (event, year) => {
    switch (event.key) {
      case 'ArrowUp':
        focusYear(year - yearsInRow);
        event.preventDefault();
        break;

      case 'ArrowDown':
        focusYear(year + yearsInRow);
        event.preventDefault();
        break;

      case 'ArrowLeft':
        focusYear(year + (theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;

      case 'ArrowRight':
        focusYear(year + (theme.direction === 'ltr' ? 1 : -1));
        event.preventDefault();
        break;
    }
  };

  return /*#__PURE__*/jsxRuntime.jsx(YearPickerRoot, {
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    children: utils.getYearRange(minDate, maxDate).map(year => {
      const yearNumber = utils.getYear(year);
      const selected = yearNumber === currentYear;
      return /*#__PURE__*/jsxRuntime.jsx(PickersYear$1, {
        selected: selected,
        value: yearNumber,
        onClick: handleYearSelection,
        onKeyDown: handleKeyDown,
        autoFocus: autoFocus && yearNumber === focusedYear,
        ref: selected ? selectedYearRef : undefined,
        disabled: disabled || disablePast && utils.isBeforeYear(year, now) || disableFuture && utils.isAfterYear(year, now) || shouldDisableYear && shouldDisableYear(year),
        children: utils.format(year, 'year')
      }, utils.format(year, 'year'));
    })
  });
});
/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 *
 * API:
 *
 * - [YearPicker API](https://mui.com/api/year-picker/)
 */

var YearPicker$1 = YearPicker;

const PickerView = styled('div')({
  overflowX: 'hidden',
  width: DIALOG_WIDTH,
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto'
});
var PickerView$1 = PickerView;

var _span;

const _excluded$7 = ["autoFocus", "onViewChange", "date", "disableFuture", "disablePast", "defaultCalendarMonth", "loading", "maxDate", "minDate", "onChange", "onMonthChange", "reduceAnimations", "renderLoading", "shouldDisableDate", "shouldDisableYear", "view", "views", "openTo", "className"];
function getCalendarPickerUtilityClass(slot) {
  return generateUtilityClass('MuiCalendarPicker', slot);
}
generateUtilityClasses('MuiCalendarPicker', ['root', 'viewTransitionContainer']);

const useUtilityClasses$1 = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    viewTransitionContainer: ['viewTransitionContainer']
  };
  return composeClasses(slots, getCalendarPickerUtilityClass, classes);
};

const CalendarPickerRoot = styled(PickerView$1, {
  name: 'MuiCalendarPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  display: 'flex',
  flexDirection: 'column'
});
const CalendarPickerViewTransitionContainer = styled(FadeTransitionGroup, {
  name: 'MuiCalendarPicker',
  slot: 'ViewTransitionContainer',
  overridesResolver: (props, styles) => styles.viewTransitionContainer
})({
  overflowY: 'auto'
});
const defaultReduceAnimations = typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent);
const CalendarPicker = /*#__PURE__*/react.forwardRef(function CalendarPicker(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiCalendarPicker'
  });

  const {
    autoFocus,
    onViewChange,
    date,
    disableFuture = false,
    disablePast = false,
    defaultCalendarMonth,
    loading = false,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onChange,
    onMonthChange,
    reduceAnimations = defaultReduceAnimations,
    renderLoading = () => _span || (_span = /*#__PURE__*/jsxRuntime.jsx("span", {
      children: "..."
    })),
    shouldDisableDate,
    shouldDisableYear,
    view,
    views = ['year', 'day'],
    openTo = 'day',
    className
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$7);

  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const minDate = minDateProp != null ? minDateProp : defaultDates.minDate;
  const maxDate = maxDateProp != null ? maxDateProp : defaultDates.maxDate;
  const {
    openView,
    setOpenView
  } = useViews({
    view,
    views,
    openTo,
    onChange,
    onViewChange
  });
  const {
    calendarState,
    changeFocusedDay,
    changeMonth,
    isDateDisabled,
    handleChangeMonth,
    onMonthSwitchingAnimationEnd
  } = useCalendarState({
    date,
    defaultCalendarMonth,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture
  });
  react.useEffect(() => {
    if (date && isDateDisabled(date)) {
      const closestEnabledDate = findClosestEnabledDate({
        utils,
        date,
        minDate,
        maxDate,
        disablePast,
        disableFuture,
        shouldDisableDate: isDateDisabled
      });
      onChange(closestEnabledDate, 'partial');
    } // This call is too expensive to run it on each prop change.
    // So just ensure that we are not rendering disabled as selected on mount.

  }, []); // eslint-disable-line

  react.useEffect(() => {
    if (date) {
      changeMonth(date);
    }
  }, [date]); // eslint-disable-line

  const ownerState = props;
  const classes = useUtilityClasses$1(ownerState);
  const monthPickerProps = {
    className,
    date,
    disabled: other.disabled,
    disablePast,
    disableFuture,
    onChange,
    minDate,
    maxDate,
    onMonthChange,
    readOnly: other.readOnly
  };
  return /*#__PURE__*/jsxRuntime.jsxs(CalendarPickerRoot, {
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    children: [/*#__PURE__*/jsxRuntime.jsx(PickersCalendarHeader, _extends({}, other, {
      views: views,
      openView: openView,
      currentMonth: calendarState.currentMonth,
      onViewChange: setOpenView,
      onMonthChange: (newMonth, direction) => handleChangeMonth({
        newMonth,
        direction
      }),
      minDate: minDate,
      maxDate: maxDate,
      disablePast: disablePast,
      disableFuture: disableFuture,
      reduceAnimations: reduceAnimations
    })), /*#__PURE__*/jsxRuntime.jsx(CalendarPickerViewTransitionContainer, {
      reduceAnimations: reduceAnimations,
      className: classes.viewTransitionContainer,
      transKey: openView,
      ownerState: ownerState,
      children: /*#__PURE__*/jsxRuntime.jsxs("div", {
        children: [openView === 'year' && /*#__PURE__*/jsxRuntime.jsx(YearPicker$1, _extends({}, other, {
          autoFocus: autoFocus,
          date: date,
          onChange: onChange,
          minDate: minDate,
          maxDate: maxDate,
          disableFuture: disableFuture,
          disablePast: disablePast,
          isDateDisabled: isDateDisabled,
          shouldDisableYear: shouldDisableYear,
          onFocusedDayChange: changeFocusedDay
        })), openView === 'month' && /*#__PURE__*/jsxRuntime.jsx(MonthPicker$1, _extends({}, monthPickerProps)), openView === 'day' && /*#__PURE__*/jsxRuntime.jsx(PickersCalendar, _extends({}, other, calendarState, {
          autoFocus: autoFocus,
          onMonthSwitchingAnimationEnd: onMonthSwitchingAnimationEnd,
          onFocusedDayChange: changeFocusedDay,
          reduceAnimations: reduceAnimations,
          date: date,
          onChange: onChange,
          isDateDisabled: isDateDisabled,
          loading: loading,
          renderLoading: renderLoading
        }))]
      })
    })]
  });
});
/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 *
 * API:
 *
 * - [CalendarPicker API](https://mui.com/api/calendar-picker/)
 */

var CalendarPicker$1 = CalendarPicker;

const useRifm = props => {
  const [, refresh] = react.useReducer(c => c + 1, 0);
  const valueRef = react.useRef(null);
  const {
    replace,
    append
  } = props;
  const userValue = replace ? replace(props.format(props.value)) : props.format(props.value); // state of delete button see comments below about inputType support

  const isDeleleteButtonDownRef = react.useRef(false);

  const onChange = evt => {

    const eventValue = evt.target.value;
    valueRef.current = [eventValue, // eventValue
    evt.target, // input
    eventValue.length > userValue.length, // isSizeIncreaseOperation
    isDeleleteButtonDownRef.current, // isDeleleteButtonDown
    userValue === props.format(eventValue) // isNoOperation
    ];
    // that allows us to calculate right cursor position after formatting (see getCursorPosition)
    // then we format new value and call props.onChange with masked/formatted value
    // and finally we are able to set cursor position into right place


    refresh();
  }; // React prints warn on server in non production mode about useLayoutEffect usage
  // in both cases it's noop


  {
    react.useLayoutEffect(() => {
      if (valueRef.current == null) return;
      let [eventValue, input, isSizeIncreaseOperation, isDeleleteButtonDown, // No operation means that value itself hasn't been changed, BTW cursor, selection etc can be changed
      isNoOperation] = valueRef.current;
      valueRef.current = null; // this usually occurs on deleting special symbols like ' here 123'123.00
      // in case of isDeleleteButtonDown cursor should move differently vs backspace

      const deleteWasNoOp = isDeleleteButtonDown && isNoOperation;
      const valueAfterSelectionStart = eventValue.slice(input.selectionStart);
      const acceptedCharIndexAfterDelete = valueAfterSelectionStart.search(props.accept || /\d/g);
      const charsToSkipAfterDelete = acceptedCharIndexAfterDelete !== -1 ? acceptedCharIndexAfterDelete : 0; // Create string from only accepted symbols

      const clean = str => (str.match(props.accept || /\d/g) || []).join('');

      const valueBeforeSelectionStart = clean(eventValue.substr(0, input.selectionStart)); // trying to find cursor position in formatted value having knowledge about valueBeforeSelectionStart
      // This works because we assume that format doesn't change the order of accepted symbols.
      // Imagine we have formatter which adds ' symbol between numbers, and by default we refuse all non numeric symbols
      // for example we had input = 1'2|'4 (| means cursor position) then user entered '3' symbol
      // inputValue = 1'23'|4 so valueBeforeSelectionStart = 123 and formatted value = 1'2'3'4
      // calling getCursorPosition("1'2'3'4") will give us position after 3, 1'2'3|'4
      // so for formatting just this function to determine cursor position after formatting is enough
      // with masking we need to do some additional checks see `mask` below

      const getCursorPosition = val => {
        let start = 0;
        let cleanPos = 0;

        for (let i = 0; i !== valueBeforeSelectionStart.length; ++i) {
          let newPos = val.indexOf(valueBeforeSelectionStart[i], start) + 1;
          let newCleanPos = clean(val).indexOf(valueBeforeSelectionStart[i], cleanPos) + 1; // this skips position change if accepted symbols order was broken
          // For example fixes edge case with fixed point numbers:
          // You have '0|.00', then press 1, it becomes 01|.00 and after format 1.00, this breaks our assumption
          // that order of accepted symbols is not changed after format,
          // so here we don't update start position if other accepted symbols was inbetween current and new position

          if (newCleanPos - cleanPos > 1) {
            newPos = start;
            newCleanPos = cleanPos;
          }

          cleanPos = Math.max(newCleanPos, cleanPos);
          start = Math.max(start, newPos);
        }

        return start;
      }; // Masking part, for masks if size of mask is above some value
      // we need to replace symbols instead of do nothing as like in format


      if (props.mask === true && isSizeIncreaseOperation && !isNoOperation) {
        let start = getCursorPosition(eventValue);
        const c = clean(eventValue.substr(start))[0];
        start = eventValue.indexOf(c, start);
        eventValue = `${eventValue.substr(0, start)}${eventValue.substr(start + 1)}`;
      }

      let formattedValue = props.format(eventValue);

      if (append != null && // cursor at the end
      input.selectionStart === eventValue.length && !isNoOperation) {
        if (isSizeIncreaseOperation) {
          formattedValue = append(formattedValue);
        } else {
          // If after delete last char is special character and we use append
          // delete it too
          // was: "12-3|" backspace pressed, then should be "12|"
          if (clean(formattedValue.slice(-1)) === '') {
            formattedValue = formattedValue.slice(0, -1);
          }
        }
      }

      const replacedValue = replace ? replace(formattedValue) : formattedValue;

      if (userValue === replacedValue) {
        // if nothing changed for formatted value, just refresh so userValue will be used at render
        refresh();
      } else {
        props.onChange(replacedValue);
      }

      return () => {
        let start = getCursorPosition(formattedValue); // Visually improves working with masked values,
        // like cursor jumping over refused symbols
        // as an example date mask: was "5|1-24-3" then user pressed "6"
        // it becomes "56-|12-43" with this code, and "56|-12-43" without

        if (props.mask != null && (isSizeIncreaseOperation || isDeleleteButtonDown && !deleteWasNoOp)) {
          while (formattedValue[start] && clean(formattedValue[start]) === '') {
            start += 1;
          }
        }

        input.selectionStart = input.selectionEnd = start + (deleteWasNoOp ? 1 + charsToSkipAfterDelete : 0);
      };
    });
  }

  react.useEffect(() => {
    // until https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType will be supported
    // by all major browsers (now supported by: +chrome, +safari, ?edge, !firefox)
    // there is no way I found to distinguish in onChange
    // backspace or delete was called in some situations
    // firefox track https://bugzilla.mozilla.org/show_bug.cgi?id=1447239
    const handleKeyDown = evt => {
      if (evt.code === 'Delete') {
        isDeleleteButtonDownRef.current = true;
      }
    };

    const handleKeyUp = evt => {
      if (evt.code === 'Delete') {
        isDeleleteButtonDownRef.current = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return {
    value: valueRef.current != null ? valueRef.current[0] : userValue,
    onChange
  };
};

function getTextFieldAriaText(rawValue, utils) {
  // TODO: should `isValid` narrow `TDate | null` to `NonNullable<TDate>`?
  // Either we allow `TDate | null` to be valid and guard against calling `formatByString` with `null`.
  // Or we ensure `formatByString` is callable with `null`.
  return rawValue && utils.isValid(utils.date(rawValue)) ? `Choose date, selected date is ${utils.format(utils.date(rawValue), 'fullDate')}` : 'Choose date';
}
const getDisplayDate = (utils, value, inputFormat) => {
  const date = utils.date(value);
  const isEmpty = value === null;

  if (isEmpty) {
    return '';
  }

  return utils.isValid(date) ? utils.formatByString( // TODO: should `isValid` narrow `TDate | null` to `NonNullable<TDate>`?
  // Either we allow `TDate | null` to be valid and guard against calling `formatByString` with `null`.
  // Or we ensure `formatByString` is callable with `null`.
  date, inputFormat) : '';
};
const MASK_USER_INPUT_SYMBOL = '_';
const staticDateWith2DigitTokens = '2019-11-21T22:30:00.000';
const staticDateWith1DigitTokens = '2019-01-01T09:00:00.000';
function checkMaskIsValidForCurrentFormat(mask, format, acceptRegex, utils) {
  const formattedDateWith1Digit = utils.formatByString(utils.date(staticDateWith1DigitTokens), format);
  const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(acceptRegex, MASK_USER_INPUT_SYMBOL);
  const inferredFormatPatternWith2Digits = utils.formatByString(utils.date(staticDateWith2DigitTokens), format).replace(acceptRegex, '_');
  const isMaskValid = inferredFormatPatternWith2Digits === mask && inferredFormatPatternWith1Digits === mask;

  if (!isMaskValid && utils.lib !== 'luxon' && "production" !== 'production') {
    console.warn(`The mask "${mask}" you passed is not valid for the format used ${format}. Falling down to uncontrolled not-masked input.`);
  }

  return isMaskValid;
}
const maskedDateFormatter = (mask, acceptRegexp) => value => {
  return value.split('').map((char, i) => {
    acceptRegexp.lastIndex = 0;

    if (i > mask.length - 1) {
      return '';
    }

    const maskChar = mask[i];
    const nextMaskChar = mask[i + 1];
    const acceptedChar = acceptRegexp.test(char) ? char : '';
    const formattedChar = maskChar === MASK_USER_INPUT_SYMBOL ? acceptedChar : maskChar + acceptedChar;

    if (i === value.length - 1 && nextMaskChar && nextMaskChar !== MASK_USER_INPUT_SYMBOL) {
      // when cursor at the end of mask part (e.g. month) prerender next symbol "21" -> "21/"
      return formattedChar ? formattedChar + nextMaskChar : '';
    }

    return formattedChar;
  }).join('');
};

function useMaskedInput({
  acceptRegex = /[\d]/gi,
  disabled,
  disableMaskedInput,
  ignoreInvalidInputs,
  inputFormat,
  inputProps,
  label,
  mask,
  onChange,
  rawValue,
  readOnly,
  rifmFormatter,
  TextFieldProps,
  validationError
}) {
  const utils = useUtils();
  const [isFocused, setIsFocused] = react.useState(false);
  const formatHelperText = utils.getFormatHelperText(inputFormat);
  const shouldUseMaskedInput = react.useMemo(() => {
    // formatting of dates is a quite slow thing, so do not make useless .format calls
    if (!mask || disableMaskedInput) {
      return false;
    }

    return checkMaskIsValidForCurrentFormat(mask, inputFormat, acceptRegex, utils);
  }, [acceptRegex, disableMaskedInput, inputFormat, mask, utils]);
  const formatter = react.useMemo(() => shouldUseMaskedInput && mask ? maskedDateFormatter(mask, acceptRegex) : st => st, [acceptRegex, mask, shouldUseMaskedInput]); // TODO: Implement with controlled vs unctrolled `rawValue`

  const currentInputValue = getDisplayDate(utils, rawValue, inputFormat);
  const [innerInputValue, setInnerInputValue] = react.useState(currentInputValue);
  const previousInputValueRef = react.useRef(currentInputValue);
  react.useEffect(() => {
    previousInputValueRef.current = currentInputValue;
  }, [currentInputValue]);
  const notTyping = !isFocused;
  const valueChanged = previousInputValueRef.current !== currentInputValue; // Update the input value only if the value changed outside of typing

  if (notTyping && valueChanged && (rawValue === null || utils.isValid(rawValue))) {
    if (currentInputValue !== innerInputValue) {
      setInnerInputValue(currentInputValue);
    }
  }

  const handleChange = text => {
    const finalString = text === '' || text === mask ? '' : text;
    setInnerInputValue(finalString);
    const date = finalString === null ? null : utils.parse(finalString, inputFormat);

    if (ignoreInvalidInputs && !utils.isValid(date)) {
      return;
    }

    onChange(date, finalString || undefined);
  };

  const rifmProps = useRifm({
    value: innerInputValue,
    onChange: handleChange,
    format: rifmFormatter || formatter
  });
  const inputStateArgs = shouldUseMaskedInput ? rifmProps : {
    value: innerInputValue,
    onChange: event => {
      handleChange(event.currentTarget.value);
    }
  };
  return _extends({
    label,
    disabled,
    error: validationError,
    inputProps: _extends({}, inputStateArgs, {
      disabled,
      placeholder: formatHelperText,
      readOnly,
      type: shouldUseMaskedInput ? 'tel' : 'text'
    }, inputProps, {
      onFocus: createDelegatedEventHandler(() => {
        setIsFocused(true);
      }, inputProps == null ? void 0 : inputProps.onFocus),
      onBlur: createDelegatedEventHandler(() => {
        setIsFocused(false);
      }, inputProps == null ? void 0 : inputProps.onBlur)
    })
  }, TextFieldProps);
}

const _excluded$6 = ["components", "disableOpenPicker", "getOpenDialogAriaText", "InputAdornmentProps", "InputProps", "inputRef", "openPicker", "OpenPickerButtonProps", "renderInput"];
const KeyboardDateInput = /*#__PURE__*/react.forwardRef(function KeyboardDateInput(props, ref) {
  const {
    components = {},
    disableOpenPicker,
    getOpenDialogAriaText = getTextFieldAriaText,
    InputAdornmentProps,
    InputProps,
    inputRef,
    openPicker,
    OpenPickerButtonProps,
    renderInput
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$6);

  const utils = useUtils();
  const textFieldProps = useMaskedInput(other);
  const adornmentPosition = (InputAdornmentProps == null ? void 0 : InputAdornmentProps.position) || 'end';
  const OpenPickerIcon = components.OpenPickerIcon || CalendarIcon;
  return renderInput(_extends({
    ref,
    inputRef
  }, textFieldProps, {
    InputProps: _extends({}, InputProps, {
      [`${adornmentPosition}Adornment`]: disableOpenPicker ? undefined : /*#__PURE__*/jsxRuntime.jsx(InputAdornment, _extends({
        position: adornmentPosition
      }, InputAdornmentProps, {
        children: /*#__PURE__*/jsxRuntime.jsx(IconButton, _extends({
          edge: adornmentPosition,
          disabled: other.disabled || other.readOnly,
          "aria-label": getOpenDialogAriaText(other.rawValue, utils)
        }, OpenPickerButtonProps, {
          onClick: openPicker,
          children: /*#__PURE__*/jsxRuntime.jsx(OpenPickerIcon, {})
        }))
      }))
    })
  }));
});

function getOrientation() {
  if (typeof window === 'undefined') {
    return 'portrait';
  }

  if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
    return Math.abs(window.screen.orientation.angle) === 90 ? 'landscape' : 'portrait';
  } // Support IOS safari


  if (window.orientation) {
    return Math.abs(Number(window.orientation)) === 90 ? 'landscape' : 'portrait';
  }

  return 'portrait';
}

function useIsLandscape(views, customOrientation) {
  const [orientation, setOrientation] = react.useState(getOrientation);
  useEnhancedEffect(() => {
    const eventHandler = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener('orientationchange', eventHandler);
    return () => {
      window.removeEventListener('orientationchange', eventHandler);
    };
  }, []);

  if (arrayIncludes(views, ['hours', 'minutes', 'seconds'])) {
    // could not display 13:34:44 in landscape mode
    return false;
  }

  const orientationToUse = customOrientation || orientation;
  return orientationToUse === 'landscape';
}

const _excluded$5 = ["autoFocus", "className", "date", "DateInputProps", "isMobileKeyboardViewOpen", "onDateChange", "onViewChange", "openTo", "orientation", "showToolbar", "toggleMobileKeyboardView", "ToolbarComponent", "toolbarFormat", "toolbarPlaceholder", "toolbarTitle", "views"];
const MobileKeyboardInputView = styled('div')({
  padding: '16px 24px'
});
const PickerRoot = styled('div')(({
  ownerState
}) => _extends({
  display: 'flex',
  flexDirection: 'column'
}, ownerState.isLandscape && {
  flexDirection: 'row'
}));
const MobileKeyboardTextFieldProps = {
  fullWidth: true
};

const isDatePickerView = view => view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = view => view === 'hours' || view === 'minutes' || view === 'seconds';

function Picker(props) {
  const {
    autoFocus,
    date,
    DateInputProps,
    isMobileKeyboardViewOpen,
    onDateChange,
    onViewChange,
    openTo,
    orientation,
    showToolbar,
    toggleMobileKeyboardView,
    ToolbarComponent = () => null,
    toolbarFormat,
    toolbarPlaceholder,
    toolbarTitle,
    views
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$5);

  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = react.useContext(WrapperVariantContext);
  const toShowToolbar = typeof showToolbar === 'undefined' ? wrapperVariant !== 'desktop' : showToolbar;
  const handleDateChange = react.useCallback((newDate, selectionState) => {
    onDateChange(newDate, wrapperVariant, selectionState);
  }, [onDateChange, wrapperVariant]);
  const handleViewChange = react.useCallback(newView => {
    if (isMobileKeyboardViewOpen) {
      toggleMobileKeyboardView();
    }

    if (onViewChange) {
      onViewChange(newView);
    }
  }, [isMobileKeyboardViewOpen, onViewChange, toggleMobileKeyboardView]);
  const {
    openView,
    nextView,
    previousView,
    setOpenView,
    handleChangeAndOpenNext
  } = useViews({
    view: undefined,
    views,
    openTo,
    onChange: handleDateChange,
    onViewChange: handleViewChange
  });
  return /*#__PURE__*/jsxRuntime.jsxs(PickerRoot, {
    ownerState: {
      isLandscape
    },
    children: [toShowToolbar && /*#__PURE__*/jsxRuntime.jsx(ToolbarComponent, _extends({}, other, {
      views: views,
      isLandscape: isLandscape,
      date: date,
      onChange: handleDateChange,
      setOpenView: setOpenView,
      openView: openView,
      toolbarTitle: toolbarTitle,
      toolbarFormat: toolbarFormat,
      toolbarPlaceholder: toolbarPlaceholder,
      isMobileKeyboardViewOpen: isMobileKeyboardViewOpen,
      toggleMobileKeyboardView: toggleMobileKeyboardView
    })), /*#__PURE__*/jsxRuntime.jsx(PickerView$1, {
      children: isMobileKeyboardViewOpen ? /*#__PURE__*/jsxRuntime.jsx(MobileKeyboardInputView, {
        children: /*#__PURE__*/jsxRuntime.jsx(KeyboardDateInput, _extends({}, DateInputProps, {
          ignoreInvalidInputs: true,
          disableOpenPicker: true,
          TextFieldProps: MobileKeyboardTextFieldProps
        }))
      }) : /*#__PURE__*/jsxRuntime.jsxs(react.Fragment, {
        children: [isDatePickerView(openView) && /*#__PURE__*/jsxRuntime.jsx(CalendarPicker$1, _extends({
          autoFocus: autoFocus,
          date: date,
          onViewChange: setOpenView,
          onChange: handleChangeAndOpenNext,
          view: openView // Unclear why the predicate `isDatePickerView` does not imply the casted type
          ,
          views: views.filter(isDatePickerView)
        }, other)), isTimePickerView(openView) && /*#__PURE__*/jsxRuntime.jsx(ClockPicker, _extends({}, other, {
          autoFocus: autoFocus,
          date: date,
          view: openView,
          onChange: handleChangeAndOpenNext,
          openNextView: () => setOpenView(nextView),
          openPreviousView: () => setOpenView(previousView),
          nextViewAvailable: !nextView,
          previousViewAvailable: !previousView || isDatePickerView(previousView),
          showViewSwitcher: wrapperVariant === 'desktop'
        }))]
      })
    })]
  });
}

function isSameDateOrTimeError(a, b) {
  return a === b;
}

function useValidation(props, validate, isSameError = isSameDateOrTimeError) {
  const {
    value,
    onError
  } = props;
  const utils = useUtils();
  const previousValidationErrorRef = react.useRef(null);
  const validationError = validate(utils, value, props);
  react.useEffect(() => {
    if (onError && !isSameError(validationError, previousValidationErrorRef.current)) {
      onError(validationError, value);
    }

    previousValidationErrorRef.current = validationError;
  }, [isSameError, onError, previousValidationErrorRef, validationError, value]);
  return validationError;
}
function useDateValidation(props) {
  return useValidation(props, validateDate, isSameDateOrTimeError);
}

function useOpenState({
  open,
  onOpen,
  onClose
}) {
  const isControllingOpenProp = react.useRef(typeof open === 'boolean').current;
  const [openState, setIsOpenState] = react.useState(false); // It is required to update inner state in useEffect in order to avoid situation when
  // Our component is not mounted yet, but `open` state is set to `true` (e.g. initially opened)

  react.useEffect(() => {
    if (isControllingOpenProp) {
      if (typeof open !== 'boolean') {
        throw new Error('You must not mix controlling and uncontrolled mode for `open` prop');
      }

      setIsOpenState(open);
    }
  }, [isControllingOpenProp, open]);
  const setIsOpen = react.useCallback(newIsOpen => {
    if (!isControllingOpenProp) {
      setIsOpenState(newIsOpen);
    }

    if (newIsOpen && onOpen) {
      onOpen();
    }

    if (!newIsOpen && onClose) {
      onClose();
    }
  }, [isControllingOpenProp, onOpen, onClose]);
  return {
    isOpen: openState,
    setIsOpen
  };
}

function usePickerState(props, valueManager) {
  const {
    disableCloseOnSelect,
    onAccept,
    onChange,
    value
  } = props;
  const utils = useUtils();
  const {
    isOpen,
    setIsOpen
  } = useOpenState(props);

  function initDraftableDate(date) {
    return {
      committed: date,
      draft: date
    };
  }

  const parsedDateValue = valueManager.parseInput(utils, value);
  const [draftState, dispatch] = react.useReducer((state, action) => {
    switch (action.type) {
      case 'reset':
        return initDraftableDate(action.payload);

      case 'update':
        return _extends({}, state, {
          draft: action.payload
        });

      default:
        return state;
    }
  }, parsedDateValue, initDraftableDate);

  if (!valueManager.areValuesEqual(utils, draftState.committed, parsedDateValue)) {
    dispatch({
      type: 'reset',
      payload: parsedDateValue
    });
  }

  const [initialDate, setInitialDate] = react.useState(draftState.committed); // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, cause we are just showing text field

  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = react.useState(false);
  const acceptDate = react.useCallback((acceptedDate, needClosePicker) => {
    onChange(acceptedDate);

    if (needClosePicker) {
      setIsOpen(false);
      setInitialDate(acceptedDate);

      if (onAccept) {
        onAccept(acceptedDate);
      }
    }
  }, [onAccept, onChange, setIsOpen]);
  const wrapperProps = react.useMemo(() => ({
    open: isOpen,
    onClear: () => acceptDate(valueManager.emptyValue, true),
    onAccept: () => acceptDate(draftState.draft, true),
    onDismiss: () => acceptDate(initialDate, true),
    onSetToday: () => {
      const now = utils.date();
      dispatch({
        type: 'update',
        payload: now
      });
      acceptDate(now, !disableCloseOnSelect);
    }
  }), [acceptDate, disableCloseOnSelect, isOpen, utils, draftState.draft, valueManager.emptyValue, initialDate]);
  const pickerProps = react.useMemo(() => ({
    date: draftState.draft,
    isMobileKeyboardViewOpen,
    toggleMobileKeyboardView: () => setMobileKeyboardViewOpen(!isMobileKeyboardViewOpen),
    onDateChange: (newDate, wrapperVariant, selectionState = 'partial') => {
      dispatch({
        type: 'update',
        payload: newDate
      });

      if (selectionState === 'partial') {
        acceptDate(newDate, false);
      }

      if (selectionState === 'finish') {
        const shouldCloseOnSelect = !(disableCloseOnSelect != null ? disableCloseOnSelect : wrapperVariant === 'mobile');
        acceptDate(newDate, shouldCloseOnSelect);
      } // if selectionState === "shallow" do nothing (we already update the draft state)

    }
  }), [acceptDate, disableCloseOnSelect, isMobileKeyboardViewOpen, draftState.draft]);
  const inputProps = react.useMemo(() => ({
    onChange,
    open: isOpen,
    rawValue: value,
    openPicker: () => setIsOpen(true)
  }), [onChange, isOpen, value, setIsOpen]);
  const pickerState = {
    pickerProps,
    inputProps,
    wrapperProps
  };
  react.useDebugValue(pickerState, () => ({
    MuiPickerState: {
      pickerDraft: draftState,
      other: pickerState
    }
  }));
  return pickerState;
}

const _excluded$4 = ["onChange", "PopperProps", "PaperProps", "ToolbarComponent", "TransitionComponent", "value", "clearText", "clearable"];
const valueManager$1 = {
  emptyValue: null,
  parseInput: parsePickerInputValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b)
};

/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 *
 * API:
 *
 * - [DesktopDatePicker API](https://mui.com/api/desktop-date-picker/)
 */
const DesktopDatePicker = /*#__PURE__*/react.forwardRef(function DesktopDatePicker(inProps, ref) {
  // TODO: TDate needs to be instantiated at every usage.
  const props = useDatePickerDefaultizedProps(inProps, 'MuiDesktopDatePicker');
  const validationError = useDateValidation(props) !== null;
  const {
    pickerProps,
    inputProps,
    wrapperProps
  } = usePickerState(props, valueManager$1);

  const {
    PopperProps,
    PaperProps,
    ToolbarComponent = DatePickerToolbar$1,
    TransitionComponent,
    clearText,
    clearable
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$4);

  const AllDateInputProps = _extends({}, inputProps, other, {
    ref,
    validationError
  });

  return /*#__PURE__*/jsxRuntime.jsx(DesktopWrapper, _extends({}, wrapperProps, {
    DateInputProps: AllDateInputProps,
    KeyboardDateInputComponent: KeyboardDateInput,
    PopperProps: PopperProps,
    PaperProps: PaperProps,
    TransitionComponent: TransitionComponent,
    clearText: clearText,
    clearable: clearable,
    children: /*#__PURE__*/jsxRuntime.jsx(Picker, _extends({}, pickerProps, {
      autoFocus: true,
      toolbarTitle: props.label || props.toolbarTitle,
      ToolbarComponent: ToolbarComponent,
      DateInputProps: AllDateInputProps
    }, other))
  }));
});
var DesktopDatePicker$1 = DesktopDatePicker;

function getDialogContentUtilityClass(slot) {
  return generateUtilityClass$1('MuiDialogContent', slot);
}
generateUtilityClasses$1('MuiDialogContent', ['root', 'dividers']);

const _excluded$3 = ["className", "dividers"];

const useUtilityClasses = ownerState => {
  const {
    classes,
    dividers
  } = ownerState;
  const slots = {
    root: ['root', dividers && 'dividers']
  };
  return composeClasses$1(slots, getDialogContentUtilityClass, classes);
};

const DialogContentRoot = styled('div', {
  name: 'MuiDialogContent',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.dividers && styles.dividers];
  }
})(({
  theme,
  ownerState
}) => _extends({
  flex: '1 1 auto',
  // Add iOS momentum scrolling for iOS < 13.0
  WebkitOverflowScrolling: 'touch',
  overflowY: 'auto',
  padding: '20px 24px'
}, ownerState.dividers ? {
  padding: '16px 24px',
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`
} : {
  [`.${dialogTitleClasses.root} + &`]: {
    paddingTop: 0
  }
}));
const DialogContent = /*#__PURE__*/react.forwardRef(function DialogContent(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDialogContent'
  });

  const {
    className,
    dividers = false
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$3);

  const ownerState = _extends({}, props, {
    dividers
  });

  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/jsxRuntime.jsx(DialogContentRoot, _extends({
    className: clsx(classes.root, className),
    ownerState: ownerState,
    ref: ref
  }, other));
});
var DialogContent$1 = DialogContent;

const PickersModalDialogRoot = styled(Dialog)({
  [`& .${dialogClasses.container}`]: {
    outline: 0
  },
  [`& .${dialogClasses.paper}`]: {
    outline: 0,
    minWidth: DIALOG_WIDTH
  }
});
const PickersModalDialogContent = styled(DialogContent$1)({
  '&:first-of-type': {
    padding: 0
  }
});
const PickersModalDialogActions = styled(DialogActions)(({
  ownerState
}) => _extends({}, (ownerState.clearable || ownerState.showTodayButton) && {
  // set justifyContent to default value to fix IE11 layout bug
  // see https://github.com/mui/material-ui-pickers/pull/267
  justifyContent: 'flex-start',
  '& > *:first-of-type': {
    marginRight: 'auto'
  }
}));

const PickersModalDialog = props => {
  const {
    cancelText = 'Cancel',
    children,
    clearable = false,
    clearText = 'Clear',
    DialogProps = {},
    okText = 'OK',
    onAccept,
    onClear,
    onDismiss,
    onSetToday,
    open,
    showTodayButton = false,
    todayText = 'Today'
  } = props;
  const ownerState = props;
  return /*#__PURE__*/jsxRuntime.jsxs(PickersModalDialogRoot, _extends({
    open: open,
    onClose: onDismiss
  }, DialogProps, {
    children: [/*#__PURE__*/jsxRuntime.jsx(PickersModalDialogContent, {
      children: children
    }), /*#__PURE__*/jsxRuntime.jsxs(PickersModalDialogActions, {
      ownerState: ownerState,
      children: [clearable && /*#__PURE__*/jsxRuntime.jsx(__pika_web_default_export_for_treeshaking__$1, {
        onClick: onClear,
        children: clearText
      }), showTodayButton && /*#__PURE__*/jsxRuntime.jsx(__pika_web_default_export_for_treeshaking__$1, {
        onClick: onSetToday,
        children: todayText
      }), cancelText && /*#__PURE__*/jsxRuntime.jsx(__pika_web_default_export_for_treeshaking__$1, {
        onClick: onDismiss,
        children: cancelText
      }), okText && /*#__PURE__*/jsxRuntime.jsx(__pika_web_default_export_for_treeshaking__$1, {
        onClick: onAccept,
        children: okText
      })]
    })]
  }));
};

var PickersModalDialog$1 = PickersModalDialog;

const _excluded$2 = ["cancelText", "children", "clearable", "clearText", "DateInputProps", "DialogProps", "okText", "onAccept", "onClear", "onDismiss", "onSetToday", "open", "PureDateInputComponent", "showTodayButton", "todayText"];

function MobileWrapper(props) {
  const {
    cancelText,
    children,
    clearable,
    clearText,
    DateInputProps,
    DialogProps,
    okText,
    onAccept,
    onClear,
    onDismiss,
    onSetToday,
    open,
    PureDateInputComponent,
    showTodayButton,
    todayText
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$2);

  return /*#__PURE__*/jsxRuntime.jsxs(WrapperVariantContext.Provider, {
    value: "mobile",
    children: [/*#__PURE__*/jsxRuntime.jsx(PureDateInputComponent, _extends({}, other, DateInputProps)), /*#__PURE__*/jsxRuntime.jsx(PickersModalDialog$1, {
      cancelText: cancelText,
      clearable: clearable,
      clearText: clearText,
      DialogProps: DialogProps,
      okText: okText,
      onAccept: onAccept,
      onClear: onClear,
      onDismiss: onDismiss,
      onSetToday: onSetToday,
      open: open,
      showTodayButton: showTodayButton,
      todayText: todayText,
      children: children
    })]
  });
}

// TODO: why is this called "Pure*" when it's not memoized? Does "Pure" mean "readonly"?
const PureDateInput = /*#__PURE__*/react.forwardRef(function PureDateInput(props, ref) {
  const {
    disabled,
    getOpenDialogAriaText = getTextFieldAriaText,
    inputFormat,
    InputProps,
    inputRef,
    label,
    openPicker: onOpen,
    rawValue,
    renderInput,
    TextFieldProps = {},
    validationError
  } = props;
  const utils = useUtils();
  const PureDateInputProps = react.useMemo(() => _extends({}, InputProps, {
    readOnly: true
  }), [InputProps]);
  const inputValue = getDisplayDate(utils, rawValue, inputFormat);
  return renderInput(_extends({
    label,
    disabled,
    ref,
    inputRef,
    error: validationError,
    InputProps: PureDateInputProps,
    inputProps: _extends({
      disabled,
      readOnly: true,
      'aria-readonly': true,
      'aria-label': getOpenDialogAriaText(rawValue, utils),
      value: inputValue
    }, !props.readOnly && {
      onClick: onOpen
    }, {
      onKeyDown: onSpaceOrEnter(onOpen)
    })
  }, TextFieldProps));
});
PureDateInput.propTypes = {
  getOpenDialogAriaText: propTypes.func,
  renderInput: propTypes.func.isRequired
};

const _excluded$1 = ["ToolbarComponent", "value", "onChange"];
const valueManager = {
  emptyValue: null,
  parseInput: parsePickerInputValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b)
};

/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 *
 * API:
 *
 * - [MobileDatePicker API](https://mui.com/api/mobile-date-picker/)
 */
const MobileDatePicker = /*#__PURE__*/react.forwardRef(function MobileDatePicker(inProps, ref) {
  // TODO: TDate needs to be instantiated at every usage.
  const props = useDatePickerDefaultizedProps(inProps, 'MuiMobileDatePicker');
  const validationError = useDateValidation(props) !== null;
  const {
    pickerProps,
    inputProps,
    wrapperProps
  } = usePickerState(props, valueManager); // Note that we are passing down all the value without spread.
  // It saves us >1kb gzip and make any prop available automatically on any level down.

  const {
    ToolbarComponent = DatePickerToolbar$1
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded$1);

  const DateInputProps = _extends({}, inputProps, other, {
    ref,
    validationError
  });

  return /*#__PURE__*/jsxRuntime.jsx(MobileWrapper, _extends({}, other, wrapperProps, {
    DateInputProps: DateInputProps,
    PureDateInputComponent: PureDateInput,
    children: /*#__PURE__*/jsxRuntime.jsx(Picker, _extends({}, pickerProps, {
      autoFocus: true,
      toolbarTitle: props.label || props.toolbarTitle,
      ToolbarComponent: ToolbarComponent,
      DateInputProps: DateInputProps
    }, other))
  }));
});
var MobileDatePicker$1 = MobileDatePicker;

const _excluded = ["cancelText", "clearable", "clearText", "desktopModeMediaQuery", "DialogProps", "okText", "PopperProps", "showTodayButton", "todayText", "TransitionComponent"];

/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/components/date-picker/)
 * - [Pickers](https://mui.com/components/pickers/)
 *
 * API:
 *
 * - [DatePicker API](https://mui.com/api/date-picker/)
 */
const DatePicker = /*#__PURE__*/react.forwardRef(function DatePicker(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDatePicker'
  });

  const {
    cancelText,
    clearable,
    clearText,
    desktopModeMediaQuery = '@media (pointer: fine)',
    DialogProps,
    okText,
    PopperProps,
    showTodayButton,
    todayText,
    TransitionComponent
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const isDesktop = useMediaQuery(desktopModeMediaQuery);
  return isDesktop ? /*#__PURE__*/jsxRuntime.jsx(DesktopDatePicker$1, _extends({
    ref: ref,
    PopperProps: PopperProps,
    TransitionComponent: TransitionComponent,
    clearText: clearText,
    clearable: clearable
  }, other)) : /*#__PURE__*/jsxRuntime.jsx(MobileDatePicker$1, _extends({
    ref: ref,
    cancelText: cancelText,
    clearable: clearable,
    clearText: clearText,
    DialogProps: DialogProps,
    okText: okText,
    showTodayButton: showTodayButton,
    todayText: todayText
  }, other));
});
var __pika_web_default_export_for_treeshaking__ = DatePicker;

export { __pika_web_default_export_for_treeshaking__ as default };
