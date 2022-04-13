import { g as getDefaultExportFromCjs, c as createCommonjsModule } from '../../common/_commonjsHelpers-37fa8da4.js';
import { i as interopRequireDefault, r as require$$1 } from '../../common/createSvgIcon-8b0a1889.js';
import { r as react } from '../../common/index-ec604146.js';
import { j as jsxRuntime } from '../../common/jsx-runtime-016d8413.js';
import '../../common/createSvgIcon-eec98421.js';
import '../../common/extends-7477639a.js';
import '../../common/objectWithoutPropertiesLoose-d5128f55.js';
import '../../common/index-c103191b.js';
import '../../common/clsx.m-114f790f.js';
import '../../common/useThemeProps-71822486.js';
import '../../common/styled-4602ab3b.js';
import '../../common/createTheme-92b2b11b.js';
import '../../common/createTheme-8608fa53.js';
import '../../common/createStyled-bbf1336f.js';
import '../../common/styleFunctionSx-92f1f5f7.js';
import '../../common/emotion-styled.browser.esm-bb03207f.js';
import '../../common/unitless.browser.esm-685a32d0.js';
import '../../common/emotion-element-99289b21.browser.esm-55d2e454.js';
import '../../common/useTheme-1877cd46.js';
import '../../common/ownerWindow-46387254.js';
import '../../common/useForkRef-36ee4a49.js';
import '../../common/debounce-735db077.js';
import '../../common/isMuiElement-48f22b82.js';
import '../../common/useId-1c9d1600.js';
import '../../common/useControlled-fa3315d7.js';
import '../../common/useIsFocusVisible-35a1b28f.js';

var YouTube = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

_interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(require$$1);



function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/(0, jsxRuntime.jsx)("path", {
  d: "M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"
}), 'YouTube');

exports.default = _default;
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(YouTube);

export { __pika_web_default_export_for_treeshaking__ as default };
