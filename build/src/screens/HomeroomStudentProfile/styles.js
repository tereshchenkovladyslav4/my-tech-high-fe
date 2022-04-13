import {MTHBLUE} from "../../utils/constants.js";
export const useStyles = {
  root: {
    flexGrow: 1,
    textTransform: "none"
  },
  activeTab: {
    backgroundColor: "#EEF4F8",
    color: "red",
    "&.Mui-selected": {
      color: MTHBLUE
    }
  }
};
