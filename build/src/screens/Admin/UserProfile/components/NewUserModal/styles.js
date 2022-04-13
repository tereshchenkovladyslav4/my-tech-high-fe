import {BLACK} from "../../../../../utils/constants.js";
export const useStyles = {
  modalCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 754,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  },
  modalStudentCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    minHeight: "200px"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: " 1px solid #E7E7E7",
    paddingBottom: "10px"
  },
  close: {
    background: "black",
    borderRadius: 1,
    color: "white",
    cursor: "pointer",
    zIndex: 10
  },
  errorOutline: {
    background: "#FAFAFA",
    borderRadius: 1,
    color: BLACK,
    marginBottom: 12,
    height: 42,
    width: 42
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  submitButton: {
    borderRadius: 8,
    width: "200px",
    marginTop: 4,
    height: "24px"
  }
};
