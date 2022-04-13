import { c as createCommonjsModule } from './_commonjsHelpers-37fa8da4.js';
import { c as createSvgIcon$1 } from './createSvgIcon-eec98421.js';
import { c as createChainedFunction, o as ownerDocument, a as ownerWindow } from './ownerWindow-46387254.js';
import { s as setRef, u as useEnhancedEffect, a as useEventCallback, b as useForkRef } from './useForkRef-36ee4a49.js';
import { c as capitalize } from './createTheme-8608fa53.js';
import { d as debounce } from './debounce-735db077.js';
import { i as isMuiElement } from './isMuiElement-48f22b82.js';
import { u as useId } from './useId-1c9d1600.js';
import { u as useControlled } from './useControlled-fa3315d7.js';
import { u as useIsFocusVisible } from './useIsFocusVisible-35a1b28f.js';
import { C as ClassNameGenerator } from './useThemeProps-71822486.js';

function deprecatedPropType(validator, reason) {
  {
    return () => null;
  }
}

function requirePropFactory(componentNameInError, Component) {
  {
    return () => null;
  } // eslint-disable-next-line react/forbid-foreign-prop-types
}

function unsupportedProp(props, propName, componentName, location, propFullName) {
  {
    return null;
  }
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  createChainedFunction: createChainedFunction,
  createSvgIcon: createSvgIcon$1,
  debounce: debounce,
  deprecatedPropType: deprecatedPropType,
  isMuiElement: isMuiElement,
  ownerDocument: ownerDocument,
  ownerWindow: ownerWindow,
  requirePropFactory: requirePropFactory,
  setRef: setRef,
  unstable_useEnhancedEffect: useEnhancedEffect,
  unstable_useId: useId,
  unsupportedProp: unsupportedProp,
  useControlled: useControlled,
  useEventCallback: useEventCallback,
  useForkRef: useForkRef,
  useIsFocusVisible: useIsFocusVisible,
  unstable_ClassNameGenerator: ClassNameGenerator
});

var interopRequireDefault = createCommonjsModule(function (module) {
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var createSvgIcon = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return utils.createSvgIcon;
  }
});
});

var require$$1 = createSvgIcon;

export { interopRequireDefault as i, require$$1 as r };
