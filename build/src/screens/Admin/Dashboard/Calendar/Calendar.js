import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import React from "../../../../../_snowpack/pkg/react.js";
import DateRangeIcon from "../../../../../_snowpack/pkg/@mui/icons-material/DateRange.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import {DataRow} from "../../../../components/DataRow/DataRow.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
export const AdminCalendar = () => {
  const data = [
    {
      date: "November 09",
      event: "Virtual Event"
    },
    {
      date: "November 10",
      event: "Field Trip"
    },
    {
      date: "November 09",
      event: "Virtual Event"
    },
    {
      date: "November 10",
      event: "Field Trip"
    },
    {
      date: "November 09",
      event: "Virtual Event"
    },
    {
      date: "November 10",
      event: "Field Trip"
    }
  ];
  const renderRows = () => map(data, (el, idx) => {
    const backgroundColor = idx === 0 || idx % 2 == 0 ? "#FAFAFA" : "white";
    return /* @__PURE__ */ React.createElement(DataRow, {
      backgroundColor,
      label: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        fontWeight: "600"
      }, el.date),
      value: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        fontWeight: "500"
      }, el.event)
    });
  });
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingX: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    fontWeight: "700"
  }, "Calendar"), /* @__PURE__ */ React.createElement(DateRangeIcon, {
    sx: {color: "#CCCCCC"}
  })), renderRows());
};
