import { r as react } from './index-ec604146.js';
import './index-c103191b.js';
import { j as jsxRuntime } from './jsx-runtime-016d8413.js';

const MuiPickersAdapterContext = /*#__PURE__*/react.createContext(null);

/**
 * @ignore - do not document.
 */
function LocalizationProvider(props) {
  const {
    children,
    dateAdapter: Utils,
    dateFormats,
    dateLibInstance,
    locale
  } = props;
  const utils = react.useMemo(() => new Utils({
    locale,
    formats: dateFormats,
    instance: dateLibInstance
  }), [Utils, locale, dateFormats, dateLibInstance]);
  const defaultDates = react.useMemo(() => {
    return {
      minDate: utils.date('1900-01-01T00:00:00.000'),
      maxDate: utils.date('2099-12-31T00:00:00.000')
    };
  }, [utils]);
  const contextValue = react.useMemo(() => {
    return {
      utils,
      defaultDates
    };
  }, [defaultDates, utils]);
  return /*#__PURE__*/jsxRuntime.jsx(MuiPickersAdapterContext.Provider, {
    value: contextValue,
    children: children
  });
}

export { LocalizationProvider as L, MuiPickersAdapterContext as M };
