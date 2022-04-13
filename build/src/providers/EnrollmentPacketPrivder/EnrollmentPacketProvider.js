import {createContext} from "../../../_snowpack/pkg/react.js";
const enrollmentContext = {
  me: void 0,
  setMe: (_) => {
  },
  currentTab: 0,
  setCurrentTab: (_) => {
  },
  packetId: 0,
  setPacketId: (_) => {
  },
  student: void 0,
  disabled: false,
  visitedTabs: [],
  setVisitedTabs: (_) => {
  }
};
export const EnrollmentContext = createContext(enrollmentContext);
