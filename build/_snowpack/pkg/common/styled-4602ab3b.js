import { c as createTheme } from './createTheme-92b2b11b.js';
import { c as createStyled, s as shouldForwardProp } from './createStyled-bbf1336f.js';

const defaultTheme = createTheme();
var defaultTheme$1 = defaultTheme;

const rootShouldForwardProp = prop => shouldForwardProp(prop) && prop !== 'classes';
const slotShouldForwardProp = shouldForwardProp;
const styled = createStyled({
  defaultTheme: defaultTheme$1,
  rootShouldForwardProp
});
var styled$1 = styled;

export { slotShouldForwardProp as a, defaultTheme$1 as d, rootShouldForwardProp as r, styled$1 as s };
