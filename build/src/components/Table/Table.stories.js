import React from "../../../_snowpack/pkg/react.js";
import {Table} from "./Table.js";
import {Title} from "../Typography/Title/Title.js";
export default {
  title: "Components/Table",
  component: Table
};
export const Default = () => {
  const tableHeaders = ["Name", "Age", "Sex"];
  const data = [
    {
      name: "Bob",
      age: 12,
      sex: "M"
    },
    {
      name: "Fob",
      age: 14,
      sex: "F"
    },
    {
      name: "Job",
      age: 56,
      sex: "M"
    }
  ];
  return /* @__PURE__ */ React.createElement(Table, {
    tableHeaders,
    tableBody: data
  });
};
export const NoHeader = () => {
  const data = [
    {
      name: "Bob",
      age: 12,
      sex: "M"
    },
    {
      name: "Fob",
      age: 14,
      sex: "F"
    },
    {
      name: "Job",
      age: 56,
      sex: "M"
    }
  ];
  return /* @__PURE__ */ React.createElement(Table, {
    tableBody: data
  });
};
export const ComponentsForCells = () => {
  const data = [
    {
      name: /* @__PURE__ */ React.createElement(Title, null, "Bob"),
      age: /* @__PURE__ */ React.createElement(Title, null, "12"),
      sex: /* @__PURE__ */ React.createElement(Title, null, "F")
    },
    {
      name: /* @__PURE__ */ React.createElement(Title, null, "Job"),
      age: /* @__PURE__ */ React.createElement(Title, null, "22"),
      sex: /* @__PURE__ */ React.createElement(Title, null, "Bob")
    },
    {
      name: /* @__PURE__ */ React.createElement(Title, null, "Fob"),
      naageme: /* @__PURE__ */ React.createElement(Title, null, "44"),
      sex: /* @__PURE__ */ React.createElement(Title, null, "F")
    }
  ];
  return /* @__PURE__ */ React.createElement(Table, {
    tableBody: data
  });
};
