import React, {useState} from "../../../../../_snowpack/pkg/react.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import "./calendar.css.proxy.js";
export const CalendarComponent = () => {
  const weekdayshort = moment.weekdaysShort();
  const [dateObject] = useState(moment());
  const rows = [];
  let cells = [];
  const totalDaysInMonth = () => dateObject.daysInMonth();
  const currentDay = () => dateObject.format("D");
  const firstDayOfMonth = () => {
    const dateObj = dateObject;
    const firstDay = moment(dateObj).startOf("month").format("d");
    return firstDay;
  };
  const weekdayshortname = weekdayshort.map((day) => /* @__PURE__ */ React.createElement("th", {
    key: day
  }, day));
  const blanks = [];
  for (let i = 0; i < firstDayOfMonth(); i++) {
    blanks.push(/* @__PURE__ */ React.createElement("td", {
      className: "calendar-day empty"
    }, ""));
  }
  const daysInMonth = [];
  for (let d = 1; d <= totalDaysInMonth(); d++) {
    const currDay = d == currentDay() ? "today" : "";
    daysInMonth.push(/* @__PURE__ */ React.createElement("td", {
      key: d,
      className: `calendar-day ${currDay}`
    }, /* @__PURE__ */ React.createElement("span", {
      onClick: () => {
      }
    }, d)));
  }
  const totalSlots = [...blanks, ...daysInMonth];
  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells);
    }
  });
  const daysinmonth = rows.map((d, i) => /* @__PURE__ */ React.createElement("tr", {
    key: i
  }, d));
  return /* @__PURE__ */ React.createElement("div", {
    style: {fontSize: 14}
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, weekdayshortname)), /* @__PURE__ */ React.createElement("tbody", null, daysinmonth))));
};
