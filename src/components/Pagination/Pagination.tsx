import { Box } from "@mui/system";
import { Pagination as MUIPagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DropDown } from "../DropDown/DropDown";
import { DropDownItem } from "../DropDown/types";
import { Paragraph } from "../Typography/Paragraph/Paragraph";
import { Subtitle } from "../Typography/Subtitle/Subtitle";
import { useStyles } from "./styles";
import { PaginationTemplateType } from "./types";

export const Pagination: PaginationTemplateType = ({
  setParentLimit,
  handlePageChange,
  defaultValue,
  numPages,
  currentPage,
}) => {
  const classes = useStyles;
  const dropdownOptions: DropDownItem[] = [
    {
      label: "25",
      value: 25,
    },
    {
      label: "50",
      value: 50,
    },
    {
      label: "100",
      value: 100,
    },
    {
      label: "All",
      value: 1000,
    },
  ];

  const [limit, setLimit] = useState();

  useEffect(() => {
    limit && setParentLimit && setParentLimit(limit);
  }, [limit]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Subtitle size="medium" sx={{ marginRight: "12px" }}>
          Show
        </Subtitle>
        <DropDown
          dropDownItems={dropdownOptions}
          setParentValue={setLimit}
          alternate={true}
          size="small"
          defaultValue={dropdownOptions[0].value}
        />
      </Box>
      <MUIPagination
        count={numPages}
        size="small"
        sx={classes.pageNumber}
        onChange={(e, pageNum) => handlePageChange && handlePageChange(pageNum)}
        page={currentPage}
      />
    </Box>
  );
};
