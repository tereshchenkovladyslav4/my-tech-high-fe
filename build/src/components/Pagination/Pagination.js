import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import {Pagination as MUIPagination} from "../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {DropDown} from "../DropDown/DropDown.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
export const Pagination = ({
  setParentLimit,
  handlePageChange,
  defaultValue,
  numPages,
  currentPage
}) => {
  const classes = useStyles;
  const dropdownOptions = [
    {
      label: "25",
      value: 25
    },
    {
      label: "50",
      value: 50
    },
    {
      label: "100",
      value: 100
    },
    {
      label: "All",
      value: 1e3
    }
  ];
  const [limit, setLimit] = useState();
  useEffect(() => {
    limit && setParentLimit && setParentLimit(limit);
  }, [limit]);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    sx: {marginRight: "12px"}
  }, "Show"), /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: dropdownOptions,
    setParentValue: setLimit,
    alternate: true,
    size: "small",
    defaultValue: defaultValue || dropdownOptions[0].value
  })), /* @__PURE__ */ React.createElement(MUIPagination, {
    count: numPages,
    size: "small",
    sx: classes.pageNumber,
    onChange: (e, pageNum) => handlePageChange && handlePageChange(pageNum),
    page: currentPage
  }));
};
