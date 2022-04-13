import {Card, Grid, IconButton} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import React, {useState} from "../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE} from "../../../../utils/constants.js";
import ExpandMoreIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ExpandMore.js";
import ExpandLessIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ExpandLess.js";
export const SchoolYear = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = [
    {
      label: "Pending",
      students: "10",
      parents: "10",
      sped: "2"
    },
    {
      label: "Active",
      students: "10,500",
      parents: "4,000",
      sped: "600"
    },
    {
      label: "Total",
      students: "10,510",
      parents: "4,010",
      sped: "602"
    },
    {
      label: "Withdrawn",
      students: "1,500",
      parents: "800",
      sped: "100"
    },
    {
      label: "Graduated",
      students: "100",
      parents: "100",
      sped: "5"
    }
  ];
  const renderRows = () => map(data, (el, idx) => {
    const backgroundColor = idx === 0 || idx % 2 == 0 ? "#FAFAFA" : "white";
    return /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      container: true,
      xs: 12,
      sx: {backgroundColor},
      paddingX: 4,
      paddingY: 2,
      textAlign: "left"
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 3
    }, /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "700"
    }, el.label)), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 3
    }, /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, el.students)), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 3
    }, /* @__PURE__ */ React.createElement(Box, {
      marginLeft: 2
    }, /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, el.sped))), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 3,
      textAlign: "left"
    }, /* @__PURE__ */ React.createElement(Box, {
      marginLeft: 4
    }, /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, el.parents))));
  });
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingX: 4,
    paddingY: 2
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "bold"
  }, "School Year"), /* @__PURE__ */ React.createElement(Box, {
    sx: {ml: 0.5, mt: 0.5}
  }, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => setIsExpanded(!isExpanded)
  }, isExpanded ? /* @__PURE__ */ React.createElement(ExpandLessIcon, {
    fontSize: "small"
  }) : /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
    fontSize: "small"
  })))), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    color: MTHBLUE,
    size: 12
  }, "20-21"), /* @__PURE__ */ React.createElement(Box, {
    sx: {ml: 0.3, mt: 1}
  }, /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
    fontSize: "small"
  })))), isExpanded && /* @__PURE__ */ React.createElement(Box, {
    sx: {padding: 4, paddingTop: 2}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "600"
  }, "Students"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "600"
  }, "Sped"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "600"
  }, "Parents"))), renderRows()))));
};
