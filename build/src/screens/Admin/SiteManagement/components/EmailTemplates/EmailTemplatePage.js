import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {Box, Grid, Card, OutlinedInput, InputAdornment, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import SearchIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {emailTemplates} from "../../../../../utils/constants.js";
import {makeStyles} from "../../../../../../_snowpack/pkg/@material-ui/core.js";
import ArrowBackIosNewIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosNew.js";
import ArrowForwardIosIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ArrowForwardIos.js";
import {EmailTemplateModal} from "./EmailTemplateModal.js";
import {useMutation} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import {createEmailTemplateMutation, updateEmailTemplateMutation} from "../../services.js";
import ArrowBackIosOutlinedIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosOutlined.js";
const useStyles = makeStyles({
  category: {
    height: "39px",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    position: "relative",
    "&:nth-child(odd)": {
      backgroundColor: "#FAFAFA",
      borderRadius: "8px"
    },
    "&:nth-child(even)": {
      height: "63px"
    }
  },
  categoryTitle: {
    width: "218px",
    position: "relative",
    fontSize: "16px",
    lineHeight: "22px",
    fontWeight: 600,
    textAlign: "left",
    padding: "0 15px",
    "&:after": {
      position: "absolute",
      content: '""',
      width: "1px",
      height: "23px",
      top: 0,
      right: 0,
      backgroundColor: "#000"
    }
  },
  templateList: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    position: "relative"
  },
  templateName: {
    minWidth: "160px",
    width: "25%",
    position: "relative",
    fontSize: "16px",
    lineHeight: "22px",
    fontWeight: 600,
    color: "#4145FF",
    cursor: "pointer",
    padding: "0 30px",
    textAlign: "left",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    "&:after": {
      position: "absolute",
      content: '""',
      width: "1px",
      height: "23px",
      top: 0,
      right: 0,
      backgroundColor: "#000"
    },
    "&:last-child:after": {
      width: 0
    }
  },
  categoryPagination: {
    display: "flex",
    alignItems: "center"
  },
  categoryPaginationItem: {
    width: "18px",
    height: "18px",
    background: "#FAFAFA",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:first-child": {
      marginRight: "5px"
    },
    "& svg": {
      fontSize: "12px"
    }
  }
});
export const EmailTemplatePage = ({onBackPress}) => {
  const [searchField, setSearchField] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const classes = useStyles();
  const handleCloseEditModal = () => {
    setOpenEdit(false);
  };
  const handleOpenEdit = (item, category) => {
    setOpenEdit(true);
    setCurrentTemplate(item);
    setCurrentCategory(category);
  };
  const [createEmailTemplate, {data: createdData}] = useMutation(createEmailTemplateMutation);
  const [updateEmailTemplate, {data: updatedData}] = useMutation(updateEmailTemplateMutation);
  const handleSave = async (data) => {
    if (data.id) {
      await updateEmailTemplate({
        variables: {
          createEmailTemplateInput: {
            emailTemplate: data,
            category: currentCategory
          }
        }
      });
    } else {
      await createEmailTemplate({
        variables: {
          createEmailTemplateInput: {
            emailTemplate: data,
            category: currentCategory
          }
        }
      });
    }
    setOpenEdit(false);
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {marginX: 4}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Card, {
    sx: {paddingTop: "24px", marginBottom: "24px", paddingBottom: "12px", marginTop: "24px"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      marginLeft: "24px",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "auto"
  }, /* @__PURE__ */ React.createElement(ArrowBackIosOutlinedIcon, {
    onClick: onBackPress,
    sx: {cursor: "pointer"}
  }), /* @__PURE__ */ React.createElement(Typography, {
    sx: {fontWeight: 700, fontSize: 20, ml: 1}
  }, "Email Templates")), /* @__PURE__ */ React.createElement(Box, {
    marginLeft: 4
  }, /* @__PURE__ */ React.createElement(OutlinedInput, {
    onFocus: (e) => e.target.placeholder = "",
    onBlur: (e) => e.target.placeholder = "Search...",
    size: "small",
    fullWidth: true,
    value: searchField,
    placeholder: "Search...",
    onChange: (e) => setSearchField(e.target.value),
    startAdornment: /* @__PURE__ */ React.createElement(InputAdornment, {
      position: "start"
    }, /* @__PURE__ */ React.createElement(SearchIcon, {
      style: {color: "black"}
    }))
  })))), /* @__PURE__ */ React.createElement(Box, {
    padding: "25px"
  }, Object.keys(emailTemplates).filter((item) => emailTemplates[item].filter((sub) => sub.title.toLowerCase().indexOf(searchField.toLowerCase()) > -1).length > 0).map((category) => /* @__PURE__ */ React.createElement(TemplatesCategories, {
    key: category,
    category,
    templates: emailTemplates[category].filter((sub) => sub.title.toLowerCase().indexOf(searchField.toLowerCase()) > -1),
    handleOpenEdit
  })))))), openEdit && /* @__PURE__ */ React.createElement(EmailTemplateModal, {
    handleModem: handleCloseEditModal,
    type: currentTemplate.template,
    category: currentCategory,
    onSave: handleSave,
    templateName: currentTemplate.title,
    availableInserts: currentTemplate.inserts
  }));
};
const TemplatesCategories = ({category, templates, handleOpenEdit}) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(Math.ceil(templates.length / 4));
  const handlePrevPage = () => {
    if (page) {
      setPage(page - 1);
    }
  };
  const handleNexPage = () => {
    if (page < total - 1) {
      setPage(page + 1);
    }
  };
  return /* @__PURE__ */ React.createElement(Box, {
    className: classes.category
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.categoryTitle
  }, category), /* @__PURE__ */ React.createElement(Box, {
    className: classes.templateList
  }, templates.slice(page * 4, page * 4 + 4).map((item, i) => /* @__PURE__ */ React.createElement(Typography, {
    key: i,
    className: classes.templateName,
    onClick: () => handleOpenEdit(item, category)
  }, item.title))), total > 1 && /* @__PURE__ */ React.createElement(Box, {
    className: classes.categoryPagination
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.categoryPaginationItem,
    onClick: handlePrevPage
  }, /* @__PURE__ */ React.createElement(ArrowBackIosNewIcon, null)), /* @__PURE__ */ React.createElement(Box, {
    className: classes.categoryPaginationItem,
    onClick: handleNexPage
  }, /* @__PURE__ */ React.createElement(ArrowForwardIosIcon, null))));
};
