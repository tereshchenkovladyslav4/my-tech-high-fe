import {createContext} from "../../../_snowpack/pkg/react.js";
import {atom} from "../../../_snowpack/pkg/recoil.js";
const userContext = {
  me: null,
  setMe: (_) => {
  }
};
const tabContext = {
  tab: null,
  setTab: (_) => {
  },
  visitedTabs: [],
  setVisitedTabs: (_) => {
  }
};
export const UserContext = createContext(userContext);
export const TabContext = createContext(tabContext);
function parseUserRegionState() {
  try {
    return JSON.parse(localStorage.getItem("selectedRegion") || "");
  } catch (e) {
    return null;
  }
}
export const userRegionState = atom({
  key: "userRegion",
  default: parseUserRegionState()
});
