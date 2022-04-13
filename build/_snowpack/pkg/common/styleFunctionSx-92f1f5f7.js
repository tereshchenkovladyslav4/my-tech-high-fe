import { n as newStyled } from './emotion-styled.browser.esm-bb03207f.js';
import { m as merge, s as style, b as createUnaryUnit, h as handleBreakpoints, g as getValue, v as values, e as spacing, i as createEmptyBreakpointObject, r as removeUnusedBreakpoints } from './createTheme-8608fa53.js';

/** @license MUI v5.4.4
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function styled(tag, options) {
  const stylesFactory = newStyled(tag, options);

  return stylesFactory;
}

function compose(...styles) {
  const handlers = styles.reduce((acc, style) => {
    style.filterProps.forEach(prop => {
      acc[prop] = style;
    });
    return acc;
  }, {});

  const fn = props => {
    return Object.keys(props).reduce((acc, prop) => {
      if (handlers[prop]) {
        return merge(acc, handlers[prop](props));
      }

      return acc;
    }, {});
  };

  fn.propTypes = {};
  fn.filterProps = styles.reduce((acc, style) => acc.concat(style.filterProps), []);
  return fn;
}

function getBorder(value) {
  if (typeof value !== 'number') {
    return value;
  }

  return `${value}px solid`;
}

const border = style({
  prop: 'border',
  themeKey: 'borders',
  transform: getBorder
});
const borderTop = style({
  prop: 'borderTop',
  themeKey: 'borders',
  transform: getBorder
});
const borderRight = style({
  prop: 'borderRight',
  themeKey: 'borders',
  transform: getBorder
});
const borderBottom = style({
  prop: 'borderBottom',
  themeKey: 'borders',
  transform: getBorder
});
const borderLeft = style({
  prop: 'borderLeft',
  themeKey: 'borders',
  transform: getBorder
});
const borderColor = style({
  prop: 'borderColor',
  themeKey: 'palette'
});
const borderTopColor = style({
  prop: 'borderTopColor',
  themeKey: 'palette'
});
const borderRightColor = style({
  prop: 'borderRightColor',
  themeKey: 'palette'
});
const borderBottomColor = style({
  prop: 'borderBottomColor',
  themeKey: 'palette'
});
const borderLeftColor = style({
  prop: 'borderLeftColor',
  themeKey: 'palette'
});
const borderRadius = props => {
  if (props.borderRadius !== undefined && props.borderRadius !== null) {
    const transformer = createUnaryUnit(props.theme, 'shape.borderRadius', 4);

    const styleFromPropValue = propValue => ({
      borderRadius: getValue(transformer, propValue)
    });

    return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
  }

  return null;
};
borderRadius.propTypes = {};
borderRadius.filterProps = ['borderRadius'];
const borders = compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius);
var borders$1 = borders;

const displayPrint = style({
  prop: 'displayPrint',
  cssProperty: false,
  transform: value => ({
    '@media print': {
      display: value
    }
  })
});
const displayRaw = style({
  prop: 'display'
});
const overflow = style({
  prop: 'overflow'
});
const textOverflow = style({
  prop: 'textOverflow'
});
const visibility = style({
  prop: 'visibility'
});
const whiteSpace = style({
  prop: 'whiteSpace'
});
var display = compose(displayPrint, displayRaw, overflow, textOverflow, visibility, whiteSpace);

const flexBasis = style({
  prop: 'flexBasis'
});
const flexDirection = style({
  prop: 'flexDirection'
});
const flexWrap = style({
  prop: 'flexWrap'
});
const justifyContent = style({
  prop: 'justifyContent'
});
const alignItems = style({
  prop: 'alignItems'
});
const alignContent = style({
  prop: 'alignContent'
});
const order = style({
  prop: 'order'
});
const flex = style({
  prop: 'flex'
});
const flexGrow = style({
  prop: 'flexGrow'
});
const flexShrink = style({
  prop: 'flexShrink'
});
const alignSelf = style({
  prop: 'alignSelf'
});
const justifyItems = style({
  prop: 'justifyItems'
});
const justifySelf = style({
  prop: 'justifySelf'
});
const flexbox = compose(flexBasis, flexDirection, flexWrap, justifyContent, alignItems, alignContent, order, flex, flexGrow, flexShrink, alignSelf, justifyItems, justifySelf);
var flexbox$1 = flexbox;

const gap = props => {
  if (props.gap !== undefined && props.gap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8);

    const styleFromPropValue = propValue => ({
      gap: getValue(transformer, propValue)
    });

    return handleBreakpoints(props, props.gap, styleFromPropValue);
  }

  return null;
};
gap.propTypes = {};
gap.filterProps = ['gap'];
const columnGap = props => {
  if (props.columnGap !== undefined && props.columnGap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8);

    const styleFromPropValue = propValue => ({
      columnGap: getValue(transformer, propValue)
    });

    return handleBreakpoints(props, props.columnGap, styleFromPropValue);
  }

  return null;
};
columnGap.propTypes = {};
columnGap.filterProps = ['columnGap'];
const rowGap = props => {
  if (props.rowGap !== undefined && props.rowGap !== null) {
    const transformer = createUnaryUnit(props.theme, 'spacing', 8);

    const styleFromPropValue = propValue => ({
      rowGap: getValue(transformer, propValue)
    });

    return handleBreakpoints(props, props.rowGap, styleFromPropValue);
  }

  return null;
};
rowGap.propTypes = {};
rowGap.filterProps = ['rowGap'];
const gridColumn = style({
  prop: 'gridColumn'
});
const gridRow = style({
  prop: 'gridRow'
});
const gridAutoFlow = style({
  prop: 'gridAutoFlow'
});
const gridAutoColumns = style({
  prop: 'gridAutoColumns'
});
const gridAutoRows = style({
  prop: 'gridAutoRows'
});
const gridTemplateColumns = style({
  prop: 'gridTemplateColumns'
});
const gridTemplateRows = style({
  prop: 'gridTemplateRows'
});
const gridTemplateAreas = style({
  prop: 'gridTemplateAreas'
});
const gridArea = style({
  prop: 'gridArea'
});
const grid = compose(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
var grid$1 = grid;

const color = style({
  prop: 'color',
  themeKey: 'palette'
});
const bgcolor = style({
  prop: 'bgcolor',
  cssProperty: 'backgroundColor',
  themeKey: 'palette'
});
const backgroundColor = style({
  prop: 'backgroundColor',
  themeKey: 'palette'
});
const palette = compose(color, bgcolor, backgroundColor);
var palette$1 = palette;

const position = style({
  prop: 'position'
});
const zIndex = style({
  prop: 'zIndex',
  themeKey: 'zIndex'
});
const top = style({
  prop: 'top'
});
const right = style({
  prop: 'right'
});
const bottom = style({
  prop: 'bottom'
});
const left = style({
  prop: 'left'
});
var positions = compose(position, zIndex, top, right, bottom, left);

const boxShadow = style({
  prop: 'boxShadow',
  themeKey: 'shadows'
});
var shadows = boxShadow;

function transform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}

const width = style({
  prop: 'width',
  transform
});
const maxWidth = props => {
  if (props.maxWidth !== undefined && props.maxWidth !== null) {
    const styleFromPropValue = propValue => {
      var _props$theme, _props$theme$breakpoi, _props$theme$breakpoi2;

      const breakpoint = ((_props$theme = props.theme) == null ? void 0 : (_props$theme$breakpoi = _props$theme.breakpoints) == null ? void 0 : (_props$theme$breakpoi2 = _props$theme$breakpoi.values) == null ? void 0 : _props$theme$breakpoi2[propValue]) || values[propValue];
      return {
        maxWidth: breakpoint || transform(propValue)
      };
    };

    return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
  }

  return null;
};
maxWidth.filterProps = ['maxWidth'];
const minWidth = style({
  prop: 'minWidth',
  transform
});
const height = style({
  prop: 'height',
  transform
});
const maxHeight = style({
  prop: 'maxHeight',
  transform
});
const minHeight = style({
  prop: 'minHeight',
  transform
});
style({
  prop: 'size',
  cssProperty: 'width',
  transform
});
style({
  prop: 'size',
  cssProperty: 'height',
  transform
});
const boxSizing = style({
  prop: 'boxSizing'
});
const sizing = compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
var sizing$1 = sizing;

const fontFamily = style({
  prop: 'fontFamily',
  themeKey: 'typography'
});
const fontSize = style({
  prop: 'fontSize',
  themeKey: 'typography'
});
const fontStyle = style({
  prop: 'fontStyle',
  themeKey: 'typography'
});
const fontWeight = style({
  prop: 'fontWeight',
  themeKey: 'typography'
});
const letterSpacing = style({
  prop: 'letterSpacing'
});
const textTransform = style({
  prop: 'textTransform'
});
const lineHeight = style({
  prop: 'lineHeight'
});
const textAlign = style({
  prop: 'textAlign'
});
const typographyVariant = style({
  prop: 'typography',
  cssProperty: false,
  themeKey: 'typography'
});
const typography = compose(typographyVariant, fontFamily, fontSize, fontStyle, fontWeight, letterSpacing, lineHeight, textAlign, textTransform);
var typography$1 = typography;

const filterPropsMapping = {
  borders: borders$1.filterProps,
  display: display.filterProps,
  flexbox: flexbox$1.filterProps,
  grid: grid$1.filterProps,
  positions: positions.filterProps,
  palette: palette$1.filterProps,
  shadows: shadows.filterProps,
  sizing: sizing$1.filterProps,
  spacing: spacing.filterProps,
  typography: typography$1.filterProps
};
const styleFunctionMapping = {
  borders: borders$1,
  display,
  flexbox: flexbox$1,
  grid: grid$1,
  positions,
  palette: palette$1,
  shadows,
  sizing: sizing$1,
  spacing,
  typography: typography$1
};
const propToStyleFunction = Object.keys(filterPropsMapping).reduce((acc, styleFnName) => {
  filterPropsMapping[styleFnName].forEach(propName => {
    acc[propName] = styleFunctionMapping[styleFnName];
  });
  return acc;
}, {});

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}

function callIfFn(maybeFn, arg) {
  return typeof maybeFn === 'function' ? maybeFn(arg) : maybeFn;
} // eslint-disable-next-line @typescript-eslint/naming-convention


function unstable_createStyleFunctionSx(styleFunctionMapping$1 = styleFunctionMapping) {
  const propToStyleFunction = Object.keys(styleFunctionMapping$1).reduce((acc, styleFnName) => {
    styleFunctionMapping$1[styleFnName].filterProps.forEach(propName => {
      acc[propName] = styleFunctionMapping$1[styleFnName];
    });
    return acc;
  }, {});

  function getThemeValue(prop, value, theme) {
    const inputProps = {
      [prop]: value,
      theme
    };
    const styleFunction = propToStyleFunction[prop];
    return styleFunction ? styleFunction(inputProps) : {
      [prop]: value
    };
  }

  function styleFunctionSx(props) {
    const {
      sx,
      theme = {}
    } = props || {};

    if (!sx) {
      return null; // emotion & styled-components will neglect null
    }
    /*
     * Receive `sxInput` as object or callback
     * and then recursively check keys & values to create media query object styles.
     * (the result will be used in `styled`)
     */


    function traverse(sxInput) {
      let sxObject = sxInput;

      if (typeof sxInput === 'function') {
        sxObject = sxInput(theme);
      } else if (typeof sxInput !== 'object') {
        // value
        return sxInput;
      }

      if (!sxObject) {
        return null;
      }

      const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
      const breakpointsKeys = Object.keys(emptyBreakpoints);
      let css = emptyBreakpoints;
      Object.keys(sxObject).forEach(styleKey => {
        const value = callIfFn(sxObject[styleKey], theme);

        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            if (propToStyleFunction[styleKey]) {
              css = merge(css, getThemeValue(styleKey, value, theme));
            } else {
              const breakpointsValues = handleBreakpoints({
                theme
              }, value, x => ({
                [styleKey]: x
              }));

              if (objectsHaveSameKeys(breakpointsValues, value)) {
                css[styleKey] = styleFunctionSx({
                  sx: value,
                  theme
                });
              } else {
                css = merge(css, breakpointsValues);
              }
            }
          } else {
            css = merge(css, getThemeValue(styleKey, value, theme));
          }
        }
      });
      return removeUnusedBreakpoints(breakpointsKeys, css);
    }

    return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
  }

  return styleFunctionSx;
}
const styleFunctionSx = unstable_createStyleFunctionSx();
styleFunctionSx.filterProps = ['sx'];
var defaultStyleFunctionSx = styleFunctionSx;

export { defaultStyleFunctionSx as d, propToStyleFunction as p, styled as s };
