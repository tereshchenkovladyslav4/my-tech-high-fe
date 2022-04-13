export const useStyles = {
  content: {
    padding: "24px 32px",
    margin: 2,
    maxHeight: "calc(100vh - 32px)",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "5px"
    },
    "&::-webkit-scrollbar-track": {
      background: "#ffffff"
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888"
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555"
    }
  },
  select: {
    maxWidth: "150px",
    color: "#F2F2F2",
    "&:before": {
      borderColor: "#fff"
    },
    "&:after": {
      borderColor: "#fff"
    }
  }
};
