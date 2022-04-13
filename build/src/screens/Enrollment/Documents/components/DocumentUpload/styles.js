import {BUTTON_LINEAR_GRADIENT} from "../../../../../utils/constants.js";
export const useStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 2,
    border: 1,
    borderColor: "#E7E7E7",
    paddingTop: "18px",
    paddingX: "18px"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "36px"
  },
  button: {
    padding: "17px 48px",
    borderRadius: "8px",
    background: BUTTON_LINEAR_GRADIENT,
    color: "white",
    alignSelf: "flex-end",
    marginBottom: "20px"
  }
};
