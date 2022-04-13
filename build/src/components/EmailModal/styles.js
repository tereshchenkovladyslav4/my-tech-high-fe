export const useStyles = {
  modalCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 828,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  },
  editor: {
    border: "1px solid #d1d1d1",
    borderRadius: 1,
    marginBottom: "24px",
    "div.DraftEditor-editorContainer": {
      minHeight: "200px",
      maxHeight: "250px",
      overflow: "scroll",
      padding: 1
    }
  },
  toolBar: {
    borderBottom: "1px solid #d1d1d1",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 1
  },
  cancelButton: {
    borderRadius: 10,
    background: "#E7E7E7",
    width: "200px",
    marginRight: 1
  },
  submitButton: {
    borderRadius: 10,
    width: "200px",
    marginLeft: 1
  },
  icon: {
    marginRight: 2,
    color: "#e7e7e7",
    cursor: "pointer"
  },
  subject: {
    marginTop: 2
  },
  isActive: {
    color: "black"
  }
};
