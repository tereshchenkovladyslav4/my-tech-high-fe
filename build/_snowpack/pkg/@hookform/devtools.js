import { r as react } from '../common/index-ec604146.js';
import { u as useFormContext, a as useFormState, b as useWatch, c as useForm, g as get } from '../common/index.esm-5d7c0cdf.js';
import { c as createCommonjsModule } from '../common/_commonjsHelpers-37fa8da4.js';
import { n as newStyled } from '../common/emotion-styled.browser.esm-bb03207f.js';
import { i as isObject_1 } from '../common/isObject-ab5f8392.js';
import '../common/extends-7477639a.js';
import '../common/unitless.browser.esm-685a32d0.js';
import '../common/emotion-element-99289b21.browser.esm-55d2e454.js';

var t=function(){var e,t={},n=[],r="__LSM__";try{e="undefined"!=typeof sessionStorage?window.sessionStorage:{};}catch(t){e={};}return {updateStore:function(n){try{t=JSON.parse(e.getItem(r)||"")||n;}catch(e){t=n;}},saveStore:function(){e.setItem(r,JSON.stringify(t));},get middleWares(){return n},set middleWares(e){n=e;},get state(){return t},set state(e){t=e;},get name(){return r},set name(e){r=e;},get storageType(){return e},set storageType(t){e=t;}}}(),n=react.createContext(void 0),r=function(r){var o=r.children,s=react.useState(t.state);return react.createElement(n.Provider,{value:{state:s[0],setState:s[1]}},o)},o="onAction";function s(e,n){n&&(n.name&&(t.name=n.name),n.storageType&&(t.storageType=n.storageType),n.middleWares&&(t.middleWares=n.middleWares),n.persist&&(o=n.persist)),t.updateStore(e);}function a(r){var s,a=(s=react.useContext(n),s),i=a.state,u=a.setState,c=react.useRef(Object.entries(r||{}).reduce(function(e,n){var r;return Object.assign({},e,((r={})[n[0]]=function(e,n){return function(r){t.state=n(t.state,r),t.middleWares&&(t.state=t.middleWares.reduce(function(e,t){return t(e,n.name,r)||e},t.state)),e(t.state),"onAction"===o&&t.saveStore();}}(u,n[1]),r))},{}));return react.useEffect(function(){"beforeUnload"===o&&(window.onbeforeunload=function(){return t.saveStore()});},[]),{actions:c.current,state:i}}

var dist = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });



var calculateTotalDuration = ({ duration = 0.3, delay = 0, overlay = 0, }) => duration + delay - overlay || 0;

var isUndefined = (val) => val === undefined;

function getSequenceId(sequenceIndex, sequenceId, defaultValue) {
    if (isUndefined(sequenceId) && isUndefined(sequenceIndex)) {
        return defaultValue || 0;
    }
    if (sequenceIndex && sequenceIndex >= 0) {
        return sequenceIndex;
    }
    if (sequenceId) {
        return sequenceId;
    }
    return 0;
}

const DEFAULT_DURATION = 0.3;
const DEFAULT_EASE_TYPE = 'linear';
const DEFAULT_DIRECTION = 'normal';
const DEFAULT_FILLMODE = 'none';
const RUNNING = 'running';
const ALL = 'all';

const AnimateContext = react.createContext({
    animationStates: {},
    register: (data) => { },
});
function AnimateGroup({ play, sequences = [], children, }) {
    const [animationStates, setAnimationStates] = react.useState({});
    const animationsRef = react.useRef({});
    const register = react.useCallback((data) => {
        const { sequenceIndex, sequenceId } = data;
        if (!isUndefined(sequenceId) || !isUndefined(sequenceIndex)) {
            animationsRef.current[getSequenceId(sequenceIndex, sequenceId)] = data;
        }
    }, []);
    react.useEffect(() => {
        const sequencesToAnimate = Array.isArray(sequences) && sequences.length
            ? sequences
            : Object.values(animationsRef.current);
        const localAnimationState = {};
        (play ? sequencesToAnimate : [...sequencesToAnimate].reverse()).reduce((previous, { sequenceId, sequenceIndex, duration = DEFAULT_DURATION, delay, overlay, }, currentIndex) => {
            const id = getSequenceId(sequenceIndex, sequenceId, currentIndex);
            const currentTotalDuration = calculateTotalDuration({
                duration,
                delay,
                overlay,
            });
            const totalDuration = currentTotalDuration + previous;
            localAnimationState[id] = {
                play,
                pause: !play,
                delay: currentIndex === 0
                    ? delay || 0
                    : delay
                        ? previous + delay
                        : previous,
                controlled: true,
            };
            return totalDuration;
        }, 0);
        setAnimationStates(localAnimationState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [play]);
    return (react.createElement(AnimateContext.Provider, { value: { animationStates, register } }, children));
}

var secToMs = (ms) => (ms || 0) * 1000;

function Animate(props) {
    const { play, children, render, start, end, complete = '', onComplete, delay = 0, duration = DEFAULT_DURATION, easeType = DEFAULT_EASE_TYPE, sequenceId, sequenceIndex, } = props;
    const onCompleteTimeRef = react.useRef();
    const [style, setStyle] = react.useState(start || {});
    const { register, animationStates = {} } = react.useContext(AnimateContext);
    const id = getSequenceId(sequenceIndex, sequenceId);
    react.useEffect(() => {
        if ((!isUndefined(sequenceIndex) && sequenceIndex >= 0) || sequenceId) {
            register(props);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react.useEffect(() => {
        const animationState = animationStates[id] || {};
        setStyle(Object.assign(Object.assign({}, (play || animationState.play ? end : start)), { transition: `${ALL} ${duration}s ${easeType} ${parseFloat(animationState.delay || delay)}s` }));
        if (play && (complete || onComplete)) {
            onCompleteTimeRef.current = setTimeout(() => {
                complete && setStyle(complete);
                onComplete && onComplete();
            }, secToMs(parseFloat(animationState.delay || delay) + duration));
        }
        return () => onCompleteTimeRef.current && clearTimeout(onCompleteTimeRef.current);
    }, [
        id,
        animationStates,
        play,
        duration,
        easeType,
        delay,
        onComplete,
        start,
        end,
        complete,
    ]);
    return render ? render({ style }) : react.createElement("div", { style: style }, children);
}

var camelCaseToDash = (camelCase) => camelCase ? camelCase.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`) : '';

const generateKeyframes = keyframes => {
    const animationLength = keyframes.length;
    return keyframes.reduce((previous, keyframe, currentIndex) => {
        const keyframePercentage = animationLength === 2
            ? currentIndex * 100
            : parseFloat((100 / (animationLength - 1)).toFixed(2)) * currentIndex;
        if (typeof keyframe === 'string') {
            return `${previous} ${keyframePercentage}% {${keyframe}}`;
        }
        const keys = Object.keys(keyframe);
        if (keys.length && isNaN(+keys[0])) {
            const keyframeContent = keys.reduce((acc, key) => `${acc} ${camelCaseToDash(key)}: ${keyframe[key]};`, '');
            return `${previous} ${keyframePercentage}% {${keyframeContent}}`;
        }
        return `${previous} ${Object.keys(keyframe)[0]}% {${Object.values(keyframe)[0]}}`;
    }, '');
};
function createStyle({ keyframes, animationName, }) {
    return `@keyframes ${animationName} {${generateKeyframes(keyframes)}}`;
}

function createTag({ keyframes, animationName, }) {
    let styleTag = document.querySelector('style[data-id=rsi]');
    let index;
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute('data-id', 'rsi');
        document.head.appendChild(styleTag);
    }
    try {
        // @ts-ignore
        index = styleTag.sheet.cssRules.length;
    }
    catch (e) {
        index = 0;
    }
    try {
        // @ts-ignore
        styleTag.sheet.insertRule(createStyle({
            keyframes,
            animationName,
        }), index);
    }
    catch (e) {
        console.error('react simple animate, error found during insert style ', e); // eslint-disable-line no-console
    }
    return {
        styleTag,
        index,
    };
}

var deleteRules = (sheet, deleteName) => {
    const index = Object.values(sheet.cssRules).findIndex(({ name }) => name === deleteName);
    if (index >= 0) {
        sheet.deleteRule(index);
    }
};

var createRandomName = () => `RSI-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

var getPlayState = (pause) => (pause ? 'paused' : RUNNING);

function AnimateKeyframes(props) {
    const { children, play = false, pause = false, render, duration = DEFAULT_DURATION, delay = 0, easeType = DEFAULT_EASE_TYPE, direction = DEFAULT_DIRECTION, fillMode = DEFAULT_FILLMODE, iterationCount = 1, sequenceIndex, keyframes, sequenceId, } = props;
    let pauseValue;
    const animationNameRef = react.useRef({
        forward: '',
        reverse: '',
    });
    const controlled = react.useRef(false);
    const styleTagRef = react.useRef({
        forward: { sheet: {} },
        reverse: { sheet: {} },
    });
    const id = getSequenceId(sequenceIndex, sequenceId);
    const { register, animationStates = {} } = react.useContext(AnimateContext);
    const animateState = animationStates[id] || {};
    const [, forceUpdate] = react.useState(false);
    react.useEffect(() => {
        const styleTag = styleTagRef.current;
        const animationName = animationNameRef.current;
        animationNameRef.current.forward = createRandomName();
        let result = createTag({
            animationName: animationNameRef.current.forward,
            keyframes,
        });
        animationNameRef.current.reverse = createRandomName();
        styleTagRef.current.forward = result.styleTag;
        result = createTag({
            animationName: animationNameRef.current.reverse,
            keyframes: keyframes.reverse(),
        });
        styleTagRef.current.reverse = result.styleTag;
        register(props);
        if (play) {
            forceUpdate(true);
        }
        return () => {
            deleteRules(styleTag.forward.sheet, animationName.forward);
            deleteRules(styleTag.reverse.sheet, animationName.reverse);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (animateState.controlled && !controlled.current) {
        pauseValue = animateState.pause;
        if (!animateState.pause) {
            controlled.current = true;
        }
    }
    else {
        pauseValue = pause;
    }
    const style = {
        animation: `${duration}s ${easeType} ${animateState.delay || delay}s ${iterationCount} ${direction} ${fillMode} ${getPlayState(pauseValue)} ${((animateState.controlled ? animateState.play : play)
            ? animationNameRef.current.forward
            : animationNameRef.current.reverse) || ''}`,
    };
    return render ? render({ style }) : react.createElement("div", { style: style || {} }, children);
}

function useAnimate(props) {
    const { start, end, complete, onComplete, delay = 0, duration = DEFAULT_DURATION, easeType = DEFAULT_EASE_TYPE, } = props;
    const transition = react.useMemo(() => `${ALL} ${duration}s ${easeType} ${delay}s`, [duration, easeType, delay]);
    const [animate, setAnimate] = react.useState({
        isPlaying: false,
        style: Object.assign(Object.assign({}, start), { transition }),
    });
    const { isPlaying, style } = animate;
    const onCompleteTimeRef = react.useRef();
    react.useEffect(() => {
        if ((onCompleteTimeRef.current || complete) && isPlaying) {
            onCompleteTimeRef.current = setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
                if (complete) {
                    setAnimate(Object.assign(Object.assign({}, animate), { style: complete }));
                }
            }, secToMs(delay + duration));
        }
        return () => onCompleteTimeRef.current && clearTimeout(onCompleteTimeRef.current);
    }, [isPlaying]);
    return {
        isPlaying,
        style,
        play: react.useCallback((isPlaying) => {
            setAnimate(Object.assign(Object.assign({}, animate), { style: Object.assign(Object.assign({}, (isPlaying ? end : start)), { transition }), isPlaying }));
        }, []),
    };
}

function useAnimateKeyframes(props) {
    const { duration = DEFAULT_DURATION, delay = 0, easeType = DEFAULT_EASE_TYPE, direction = DEFAULT_DIRECTION, fillMode = DEFAULT_FILLMODE, iterationCount = 1, keyframes, } = props;
    const animationNameRef = react.useRef({
        forward: '',
        reverse: '',
    });
    const styleTagRef = react.useRef({
        forward: { sheet: {} },
        reverse: { sheet: {} },
    });
    const { register } = react.useContext(AnimateContext);
    const [isPlaying, setIsPlaying] = react.useState(null);
    const [isPaused, setIsPaused] = react.useState(false);
    const playRef = react.useRef();
    react.useEffect(() => {
        const styleTag = styleTagRef.current;
        const animationName = animationNameRef.current;
        animationNameRef.current.forward = createRandomName();
        let result = createTag({
            animationName: animationNameRef.current.forward,
            keyframes,
        });
        styleTagRef.current.forward = result.styleTag;
        animationNameRef.current.reverse = createRandomName();
        result = createTag({
            animationName: animationNameRef.current.reverse,
            keyframes: keyframes.reverse(),
        });
        styleTagRef.current.reverse = result.styleTag;
        register(props);
        return () => {
            deleteRules(styleTag.forward.sheet, animationName.forward);
            deleteRules(styleTag.reverse.sheet, animationName.reverse);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    playRef.current = playRef.current
        ? playRef.current
        : (isPlay) => setIsPlaying(isPlay);
    const style = {
        animation: `${duration}s ${easeType} ${delay}s ${iterationCount} ${direction} ${fillMode} ${getPlayState(isPaused)} ${isPlaying === null
            ? ''
            : isPlaying
                ? animationNameRef.current.forward
                : animationNameRef.current.reverse}`,
    };
    return {
        style,
        play: playRef.current,
        pause: setIsPaused,
        isPlaying: !!isPlaying,
    };
}

function createArrayWithNumbers(length) {
    return Array.from({ length }, () => null);
}

function useAnimateGroup(props) {
    const { sequences = [] } = props;
    const defaultArray = createArrayWithNumbers(sequences.length).map((_, index) => props.sequences[index].start);
    const [styles, setStyles] = react.useState(defaultArray);
    const [isPlaying, setPlaying] = react.useState(false);
    const animationNamesRef = react.useRef([]);
    const styleTagRef = react.useRef([]);
    const playRef = react.useRef();
    react.useEffect(() => {
        sequences.forEach(({ keyframes = false }, i) => {
            if (!Array.isArray(keyframes)) {
                return;
            }
            if (!animationNamesRef.current[i]) {
                animationNamesRef.current[i] = {};
                styleTagRef.current[i] = {};
            }
            animationNamesRef.current[i].forward = createRandomName();
            let result = createTag({
                animationName: animationNamesRef.current[i].forward,
                keyframes,
            });
            styleTagRef.current[i].forward = result.styleTag;
            animationNamesRef.current[i].reverse = createRandomName();
            result = createTag({
                animationName: animationNamesRef.current[i].reverse,
                keyframes: keyframes.reverse(),
            });
            styleTagRef.current[i].reverse = result.styleTag;
        });
        return () => Object.values(animationNamesRef).forEach(({ forward, reverse }, i) => {
            if (!styleTagRef[i]) {
                return;
            }
            deleteRules(styleTagRef[i].sheet, forward);
            deleteRules(styleTagRef[i].sheet, reverse);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    playRef.current = playRef.current
        ? playRef.current
        : (isPlay) => {
            let totalDuration = 0;
            const animationRefWithOrder = isPlay
                ? animationNamesRef.current
                : [...animationNamesRef.current].reverse();
            const styles = (isPlay ? sequences : [...sequences].reverse()).map((current, currentIndex) => {
                const { duration = DEFAULT_DURATION, delay = 0, overlay, keyframes, iterationCount = 1, easeType = DEFAULT_EASE_TYPE, direction = DEFAULT_DIRECTION, fillMode = DEFAULT_FILLMODE, end = {}, start = {}, } = current;
                const delayDuration = currentIndex === 0 ? delay : totalDuration;
                const transition = `${ALL} ${duration}s ${easeType} ${delayDuration}s`;
                totalDuration =
                    calculateTotalDuration({ duration, delay, overlay }) +
                        totalDuration;
                return keyframes
                    ? {
                        animation: `${duration}s ${easeType} ${delayDuration}s ${iterationCount} ${direction} ${fillMode} ${RUNNING} ${isPlay
                            ? animationRefWithOrder[currentIndex].forward
                            : animationRefWithOrder[currentIndex].reverse}`,
                    }
                    : Object.assign(Object.assign({}, (isPlay ? end : start)), { transition });
            });
            setStyles(isPlay ? styles : [...styles].reverse());
            setPlaying(!isPlaying);
        };
    return { styles, play: playRef.current, isPlaying };
}

exports.Animate = Animate;
exports.AnimateGroup = AnimateGroup;
exports.AnimateKeyframes = AnimateKeyframes;
exports.useAnimate = useAnimate;
exports.useAnimateGroup = useAnimateGroup;
exports.useAnimateKeyframes = useAnimateKeyframes;
});

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

var isUndefined_1 = isUndefined;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var colors = {
    primary: '#0e101c',
    secondary: '#bf1650',
    lightBlue: '#516391',
    blue: '#1e2a4a',
    lightPink: '#ec5990',
    errorPink: '#fbecf2',
    buttonBlue: '#191d3a',
    link: '#ff7aa8',
    green: '#1bda2b',
};

var paraGraphDefaultStyle = {
    fontSize: 13,
    lineHeight: '20px',
};
var Button = newStyled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  appearance: none;\n  margin: 0;\n  border: 0;\n  color: white;\n  padding: 5px !important;\n  border-radius: 0 !important;\n  background: ", ";\n  transition: 0.2s all;\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  appearance: none;\n  margin: 0;\n  border: 0;\n  color: white;\n  padding: 5px !important;\n  border-radius: 0 !important;\n  background: ",
    ";\n  transition: 0.2s all;\n\n  &:hover {\n    background: ", ";\n  }\n"])), function (props) {
    return props.hideBackground ? "" : colors.blue + " !important";
}, colors.lightBlue);
Button.defaultProps = { type: 'button' };
var CircleButton = newStyled(Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: bold;\n  margin: 0 4px 0 auto;\n  background: none !important;\n  display: flex;\n  width: 25px;\n  height: 25px;\n  justify-content: center;\n  line-height: 14px !important;\n  border-radius: 50% !important;\n  padding: 0 !important;\n  transition: 0.2s all;\n\n  &:hover {\n    background: ", ";\n  }\n\n  &:active {\n    background: black;\n  }\n"], ["\n  font-size: 14px;\n  font-weight: bold;\n  margin: 0 4px 0 auto;\n  background: none !important;\n  display: flex;\n  width: 25px;\n  height: 25px;\n  justify-content: center;\n  line-height: 14px !important;\n  border-radius: 50% !important;\n  padding: 0 !important;\n  transition: 0.2s all;\n\n  &:hover {\n    background: ", ";\n  }\n\n  &:active {\n    background: black;\n  }\n"])), colors.lightBlue);
var Input = newStyled.input(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  &::placeholder {\n    color: #b3b3b3;\n  }\n\n  &:focus::placeholder {\n    color: white;\n  }\n"], ["\n  &::placeholder {\n    color: #b3b3b3;\n  }\n\n  &:focus::placeholder {\n    color: white;\n  }\n"])));
var Table = newStyled.table(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  transition: 0.3s all;\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  transition: 0.3s all;\n\n  &:hover {\n    background: ", ";\n  }\n"])), colors.primary);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;

var Header = function (_a) {
    var setVisible = _a.setVisible, control = _a.control;
    var isValid = useFormState({
        control: control,
    }).isValid;
    return (react.createElement("header", { style: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            backgroundColor: 'transparent',
        } },
        react.createElement("p", { style: __assign(__assign({}, paraGraphDefaultStyle), { margin: 0, padding: 0, fontWeight: 400, fontSize: 12 }) },
            react.createElement("span", { style: {
                    transition: '0.5s all',
                    color: isValid ? colors.green : colors.lightPink,
                } }, "\u25A0"),
            ' ',
            "React Hook Form"),
        react.createElement(CircleButton, { title: "Close dev panel", onClick: function () { return setVisible(false); } }, "\u2715")));
};

var PanelTable = function (_a) {
    var refObject = _a.refObject, hasError = _a.hasError, isDirty = _a.isDirty, fieldsValues = _a.fieldsValues, isNative = _a.isNative, errorMessage = _a.errorMessage, errorType = _a.errorType, type = _a.type, isTouched = _a.isTouched, name = _a.name, collapseAll = _a.collapseAll;
    var _b = react.useState(false), collapse = _b[0], setCollapse = _b[1];
    react.useEffect(function () {
        setCollapse(!collapseAll);
    }, [collapseAll]);
    var value = fieldsValues ? get(fieldsValues, name) : '';
    var isValueWrappedInPre = false;
    if (!isUndefined_1(value)) {
        if (isObject_1(value)) {
            try {
                value = (react.createElement("pre", { style: { margin: 0 } },
                    react.createElement("code", { style: { fontSize: 12 } }, JSON.stringify(value, null, 2))));
                isValueWrappedInPre = true;
            }
            catch (_c) {
                value = react.createElement("span", null, "[Nested Object]");
            }
        }
        else if (typeof value !== 'string') {
            value = String(value);
        }
    }
    return (react.createElement(Table, { style: {
            padding: '5px 8px',
            width: '100%',
            transition: '.3s all',
            borderLeft: "2px solid " + (hasError ? colors.secondary : colors.buttonBlue),
            background: 'none',
        } },
        react.createElement("thead", null,
            react.createElement("tr", null,
                react.createElement("td", { valign: "top", style: { width: 85, lineHeight: '22px' } },
                    react.createElement(Button, { onClick: function () { return setCollapse(!collapse); }, title: "Toggle field table", style: {
                            border: "1px solid " + colors.lightBlue,
                            borderRadius: 2,
                            padding: '3px 5px',
                            display: 'inline-block',
                            fontSize: 9,
                            lineHeight: '13px',
                            width: 20,
                            textAlign: 'center',
                            marginRight: 8,
                        } }, collapse ? '+' : '-'),
                    react.createElement(Button, { onClick: function () {
                            if (refObject.scrollIntoView) {
                                refObject.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, title: "Scroll into view", style: __assign({ border: "1px solid " + colors.lightBlue, borderRadius: 2, padding: '3px 5px', display: 'inline-block', fontSize: 9, lineHeight: '13px', textAlign: 'center', width: 'calc(100% - 30px)' }, (isNative
                            ? {}
                            : { cursor: 'not-allowed', background: colors.lightBlue })) }, isNative ? 'Native' : 'Custom')),
                react.createElement("td", { style: {
                        display: 'block',
                        maxWidth: 140,
                    } },
                    react.createElement("p", { style: __assign(__assign({ margin: 0, padding: 0, top: 0, position: 'relative', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, paraGraphDefaultStyle), { lineHeight: '24px' }), title: name }, name)))),
        !collapse && (react.createElement("tbody", null,
            type && (react.createElement("tr", null,
                react.createElement("td", { align: "right", style: __assign({ paddingRight: 5, fontWeight: 500, verticalAlign: 'top' }, paraGraphDefaultStyle) }, "Type:"),
                react.createElement("td", { style: __assign({ display: 'block', maxWidth: 100 }, paraGraphDefaultStyle) }, type))),
            errorType && (react.createElement("tr", null,
                react.createElement("td", { align: "right", style: __assign({ paddingRight: 5, fontWeight: 500, verticalAlign: 'top' }, paraGraphDefaultStyle) }, "ERROR Type:"),
                react.createElement("td", { style: __assign({ display: 'block', maxWidth: 100 }, paraGraphDefaultStyle) }, errorType))),
            errorMessage && (react.createElement("tr", null,
                react.createElement("td", { align: "right", style: __assign({ paddingRight: 5, fontWeight: 500, verticalAlign: 'top' }, paraGraphDefaultStyle) }, "MESSAGE:"),
                react.createElement("td", { style: __assign({ display: 'block', maxWidth: 100 }, paraGraphDefaultStyle) }, typeof errorMessage === 'string'
                    ? errorMessage.trim()
                    : JSON.stringify(errorMessage)))),
            !isUndefined_1(value) && (react.createElement("tr", null,
                react.createElement("td", { align: "right", style: __assign({ paddingRight: 5, fontWeight: 500, verticalAlign: 'top' }, paraGraphDefaultStyle) }, "Value:"),
                react.createElement("td", { "data-testid": name + "-field-value", style: __assign({ display: 'block', maxWidth: 100 }, paraGraphDefaultStyle) },
                    !isValueWrappedInPre && (react.createElement("p", { title: value, style: __assign(__assign({}, paraGraphDefaultStyle), { margin: 0, padding: 0 }) }, value)),
                    isValueWrappedInPre && (react.createElement("div", { style: __assign(__assign({}, paraGraphDefaultStyle), { margin: 0, padding: 0 }) }, value))))),
            react.createElement("tr", null,
                react.createElement("td", { align: "right", style: __assign({ paddingRight: 5, fontWeight: 500, verticalAlign: 'top' }, paraGraphDefaultStyle) }, "Touched:"),
                react.createElement("td", null,
                    react.createElement("code", { style: __assign(__assign({ color: isTouched ? colors.green : colors.lightPink }, paraGraphDefaultStyle), { fontSize: 12 }) }, isTouched ? 'true' : 'false'))),
            react.createElement("tr", null,
                react.createElement("td", { align: "right", style: __assign({ paddingRight: 5, fontWeight: 500, verticalAlign: 'top' }, paraGraphDefaultStyle) }, "Dirty:"),
                react.createElement("td", null,
                    react.createElement("code", { style: __assign(__assign({ color: isDirty ? colors.green : colors.lightPink }, paraGraphDefaultStyle), { fontSize: 12 }) }, isDirty ? 'true' : 'false')))))));
};

var FormStateTable = function (_a) {
    var formState = _a.formState, showFormState = _a.showFormState, setShowFormState = _a.setShowFormState;
    return (react.createElement("div", { style: {
            alignSelf: 'end',
        } },
        react.createElement(dist.Animate, { play: showFormState, start: { opacity: 0 }, end: { opacity: 1 }, render: function (_a) {
                var style = _a.style;
                return (react.createElement("table", { style: __assign({ padding: '5px 10px', display: 'block', background: 'black', borderTop: "1px solid " + colors.lightPink, pointerEvents: 'none' }, style) },
                    react.createElement("tbody", null,
                        react.createElement("tr", null,
                            react.createElement("td", { align: "right", style: __assign({ width: 90 }, paraGraphDefaultStyle) }, "Valid:"),
                            react.createElement("td", { style: __assign({ color: formState.isValid ? colors.green : colors.lightPink }, paraGraphDefaultStyle) }, formState.isValid ? 'true' : 'false')),
                        react.createElement("tr", null,
                            react.createElement("td", { align: "right", style: __assign({}, paraGraphDefaultStyle) }, "Dirty:"),
                            react.createElement("td", { style: __assign({ color: formState.isDirty ? colors.green : colors.lightPink }, paraGraphDefaultStyle) }, formState.isDirty ? 'true' : 'false')),
                        react.createElement("tr", null,
                            react.createElement("td", { align: "right", style: __assign({}, paraGraphDefaultStyle) }, "Submitted:"),
                            react.createElement("td", { style: __assign({ color: formState.isSubmitted
                                        ? colors.green
                                        : colors.lightPink }, paraGraphDefaultStyle) }, formState.isSubmitted ? 'true' : 'false')),
                        react.createElement("tr", null,
                            react.createElement("td", { align: "right", style: __assign({}, paraGraphDefaultStyle) }, "Count:"),
                            react.createElement("td", { style: __assign({ color: formState.submitCount
                                        ? colors.green
                                        : colors.lightPink }, paraGraphDefaultStyle) }, formState.submitCount)),
                        react.createElement("tr", null,
                            react.createElement("td", { align: "right", style: __assign({}, paraGraphDefaultStyle) }, "Submitting:"),
                            react.createElement("td", { style: __assign({ color: formState.isSubmitting
                                        ? colors.green
                                        : colors.lightPink }, paraGraphDefaultStyle) }, formState.isSubmitting ? 'true' : 'false')))));
            } }),
        react.createElement(Button, { style: {
                margin: 0,
                width: '100%',
                padding: '8px 10px',
                textTransform: 'none',
                fontSize: 12,
                lineHeight: '14px',
                cursor: 'pointer',
            }, title: "Toggle form state panel", onClick: function () {
                setShowFormState(!showFormState);
            } },
            react.createElement("span", { style: {
                    transition: '0.5s all',
                    color: formState.isValid ? colors.green : colors.lightPink,
                } }, "\u25A0"),
            ' ',
            "Form State: ",
            showFormState ? 'OFF' : 'ON')));
};

function setVisible(state, payload) {
    return __assign(__assign({}, state), { visible: payload });
}
function setCollapse(state, payload) {
    return __assign(__assign({}, state), { isCollapse: payload });
}

var childIndex = 0;
function PanelChildren(_a) {
    var fields = _a.fields, searchTerm = _a.searchTerm, touchedFields = _a.touchedFields, errors = _a.errors, dirtyFields = _a.dirtyFields, state = _a.state, fieldsValues = _a.fieldsValues;
    return (react.createElement(react.Fragment, null, fields &&
        Object.entries(fields)
            .filter(function (_a) {
            var name = _a[0];
            return ((name &&
                name.toLowerCase &&
                name.toLowerCase().includes(searchTerm)) ||
                (!name && !searchTerm) ||
                searchTerm === '') &&
                name;
        })
            .map(function (_a, index) {
            var name = _a[0], value = _a[1];
            childIndex++;
            if (!(value === null || value === void 0 ? void 0 : value._f)) {
                return (react.createElement(PanelChildren, __assign({ key: name + childIndex }, {
                    fields: value,
                    searchTerm: searchTerm,
                    touchedFields: touchedFields,
                    errors: errors,
                    dirtyFields: dirtyFields,
                    state: state,
                    fieldsValues: fieldsValues,
                })));
            }
            else {
                var error = get(errors, value._f.name);
                var errorMessage = get(error, 'message', undefined);
                var errorType = get(error, 'type', undefined);
                var type = get(value, 'ref.type', undefined);
                var isTouched = !!get(touchedFields, value._f.name);
                var isNative = !!(value && value._f.ref.type);
                var isDirty = !!get(dirtyFields, value._f.name);
                var hasError = !!error;
                var ref = get(value, '_f.ref');
                return (react.createElement("section", { key: (value === null || value === void 0 ? void 0 : value._f.name) + childIndex, style: {
                        borderBottom: "1px dashed " + colors.secondary,
                        margin: 0,
                    } },
                    react.createElement(PanelTable, { refObject: ref, index: index, collapseAll: state.isCollapse, name: value === null || value === void 0 ? void 0 : value._f.name, isTouched: isTouched, type: type, hasError: hasError, isNative: isNative, errorMessage: errorMessage, errorType: errorType, isDirty: isDirty, fieldsValues: fieldsValues })));
            }
        })));
}
var Panel = function (_a) {
    var control = _a.control, _fields = _a.control._fields;
    var formState = useFormState({
        control: control,
    });
    var dirtyFields = formState.dirtyFields, touchedFields = formState.touchedFields, errors = formState.errors;
    formState.isDirty;
    var _b = a({
        setCollapse: setCollapse,
    }), state = _b.state, actions = _b.actions;
    var _c = react.useState({}), setData = _c[1];
    var _d = react.useState(false), showFormState = _d[0], setShowFormState = _d[1];
    var fieldsValues = useWatch({
        control: control,
    });
    var _e = useForm(), register = _e.register, watch = _e.watch;
    var searchTerm = watch('search', '');
    react.useEffect(function () {
        setData({});
    }, []);
    return (react.createElement("div", { style: {
            display: 'grid',
            gridTemplateRows: '56px auto',
            height: 'calc(100vh - 40px)',
        } },
        react.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: '28px 28px',
            } },
            react.createElement(Button, { style: {
                    borderRight: "1px solid " + colors.primary,
                    textTransform: 'none',
                    fontSize: 11,
                    lineHeight: 1,
                }, title: "Update values and state the form", onClick: function () { return setData({}); } }, "\u267A REFRESH"),
            react.createElement(Button, { style: {
                    borderRight: "1px solid " + colors.primary,
                    textTransform: 'none',
                    fontSize: 11,
                    lineHeight: 1,
                }, title: "Toggle entire fields", onClick: function () {
                    actions.setCollapse(!state.isCollapse);
                } }, state.isCollapse ? '[-] COLLAPSE' : '[+] EXPAND'),
            react.createElement(Input, __assign({ style: {
                    display: 'inline-block',
                    borderRadius: 0,
                    width: '100%',
                    margin: 0,
                    padding: '5px 10px',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    fontSize: 14,
                    border: 0,
                    color: 'white',
                    gridColumnStart: 1,
                    gridColumnEnd: 4,
                    background: 'black',
                } }, register('search'), { placeholder: "Filter name...", type: "search" }))),
        react.createElement("div", { style: {
                overflow: 'auto',
            } },
            react.createElement(PanelChildren, { fields: _fields, searchTerm: searchTerm, errors: errors, touchedFields: touchedFields, dirtyFields: dirtyFields, fieldsValues: fieldsValues, state: state })),
        react.createElement(FormStateTable, { formState: formState, showFormState: showFormState, setShowFormState: setShowFormState })));
};

var Logo = function (_a) {
    var style = _a.style, actions = _a.actions;
    return (react.createElement("svg", { fill: "white", viewBox: "0 0 100 100", style: __assign({ height: 14, padding: 3, borderRadius: 2, background: colors.lightPink }, style), onClick: function () {
            actions.setVisible(true);
        }, "aria-label": "React Hook Form Logo" },
        react.createElement("path", { d: "M73.56,13.32H58.14a8.54,8.54,0,0,0-16.27,0H26.44a11,11,0,0,0-11,11V81.63a11,11,0,0,0,11,11H73.56a11,11,0,0,0,11-11V24.32A11,11,0,0,0,73.56,13.32Zm-30.92,2a1,1,0,0,0,1-.79,6.54,6.54,0,0,1,12.78,0,1,1,0,0,0,1,.79h5.38v6.55a3,3,0,0,1-3,3H40.25a3,3,0,0,1-3-3V15.32ZM82.56,81.63a9,9,0,0,1-9,9H26.44a9,9,0,0,1-9-9V24.32a9,9,0,0,1,9-9h8.81v6.55a5,5,0,0,0,5,5h19.5a5,5,0,0,0,5-5V15.32h8.81a9,9,0,0,1,9,9Z" }),
        react.createElement("path", { style: { transform: 'translateX(-25px)' }, d: "M71.6,45.92H54a1,1,0,0,0,0,2H71.6a1,1,0,0,0,0-2Z" }),
        react.createElement("path", { d: "M71.6,45.92H54a1,1,0,0,0,0,2H71.6a1,1,0,0,0,0-2Z" }),
        react.createElement("path", { style: { transform: 'translateX(-25px)' }, d: "M71.1,69.49H53.45a1,1,0,1,0,0,2H71.1a1,1,0,0,0,0-2Z" }),
        react.createElement("path", { d: "M71.1,69.49H53.45a1,1,0,1,0,0,2H71.1a1,1,0,0,0,0-2Z" })));
};

function getPositionByPlacement(placement, defaultX, defaultY) {
    var _a;
    if (defaultX === void 0) { defaultX = 0; }
    if (defaultY === void 0) { defaultY = 0; }
    var _b = placement.split('-'), x = _b[0], y = _b[1];
    return _a = {},
        _a[x] = defaultX,
        _a[y] = defaultY,
        _a;
}

var DevToolUI = function (_a) {
    var control = _a.control, _b = _a.placement, placement = _b === void 0 ? 'top-right' : _b;
    var _c = a({
        setVisible: setVisible,
    }), state = _c.state, actions = _c.actions;
    var position = getPositionByPlacement(placement, 0, 0);
    return (react.createElement(react.Fragment, null,
        react.createElement(dist.Animate, { play: state.visible, duration: 0.2, start: __assign(__assign({}, position), { position: 'fixed', transform: placement.includes('right')
                    ? 'translateX(280px)'
                    : 'translateX(-280px)', zIndex: 99999 }), end: __assign(__assign({}, position), { position: 'fixed', transform: 'translateX(0)', zIndex: 99999 }) },
            react.createElement("div", { style: __assign(__assign({}, position), { position: 'fixed', height: '100vh', width: 250, zIndex: 99999, background: colors.buttonBlue, display: 'grid', textAlign: 'left', color: 'white', fontSize: 14, gridTemplateRows: '40px auto', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" }) },
                react.createElement(Header, { setVisible: actions.setVisible, control: control }),
                react.createElement(Panel, { control: control }))),
        !state.visible && (react.createElement(Button, { title: "Show dev panel", hideBackground: true, style: __assign(__assign({ position: 'fixed', zIndex: 99999 }, getPositionByPlacement(placement, 3, 3)), { padding: 3, margin: 0, background: 'none' }) },
            react.createElement(Logo, { actions: actions })))));
};

if (typeof window !== 'undefined') {
    s({
        visible: true,
        isCollapse: false,
        filterName: '',
    }, {
        name: '__REACT_HOOK_FORM_DEVTOOLS__',
        middleWares: [],
        storageType: window.localStorage,
    });
}
var DevTool = function (props) {
    var methods = useFormContext();
    return (react.createElement(r, null,
        react.createElement(DevToolUI, { control: (props && props.control) || methods.control, placement: props === null || props === void 0 ? void 0 : props.placement })));
};

export { DevTool };
