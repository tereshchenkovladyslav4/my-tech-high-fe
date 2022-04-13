import { r as react } from './index-ec604146.js';

/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
function useControlled({
  controlled,
  default: defaultProp,
  name,
  state = 'value'
}) {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const {
    current: isControlled
  } = react.useRef(controlled !== undefined);
  const [valueState, setValue] = react.useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  const setValueIfUncontrolled = react.useCallback(newValue => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
}

export { useControlled as u };
