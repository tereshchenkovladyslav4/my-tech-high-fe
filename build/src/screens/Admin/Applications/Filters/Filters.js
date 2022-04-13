import {Box, Button, Card, Checkbox, FormControlLabel, Grid} from "../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import ChevronRightIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ChevronRight.js";
import ExpandMoreIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ExpandMore.js";
import {BUTTON_LINEAR_GRADIENT, MTHBLUE, RED_GRADIENT, GRADES} from "../../../../utils/constants.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import {toOrdinalSuffix} from "../../../../utils/stringHelpers.js";
import {useHistory} from "../../../../../_snowpack/pkg/react-router-dom.js";
export const Filters = ({filter, setFilter}) => {
  const history = useHistory();
  const [expand, setExpand] = useState(false);
  const [grades, setGrades] = useState([]);
  const [schoolYear, setSchoolYear] = useState([]);
  const [specialEd, setSpecialEd] = useState([]);
  const [status, setStatus] = useState([]);
  const [accountStatus, setAccountStatus] = useState([]);
  const [visibility, setVisibility] = useState([]);
  const chevron = () => !expand ? /* @__PURE__ */ React.createElement(ChevronRightIcon, {
    sx: {
      color: MTHBLUE,
      verticalAlign: "bottom",
      cursor: "pointer"
    }
  }) : /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
    sx: {
      color: MTHBLUE,
      verticalAlign: "bottom",
      cursor: "pointer"
    }
  });
  const handleChangeGrades = (e) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== "all"));
    } else {
      setGrades([...grades, e.target.value]);
    }
  };
  const handleChangeSchoolYear = (e) => {
    if (schoolYear.includes(e.target.value)) {
      setSchoolYear(schoolYear.filter((item) => item !== e.target.value));
    } else {
      setSchoolYear([...schoolYear, e.target.value]);
    }
  };
  const handleChangeSpecialEd = (e) => {
    if (specialEd.includes(e.target.value)) {
      setSpecialEd(specialEd.filter((item) => item !== e.target.value));
    } else {
      setSpecialEd([...specialEd, e.target.value]);
    }
  };
  const handleChangeStatus = (e) => {
    if (status.includes(e.target.value)) {
      setStatus(status.filter((item) => item !== e.target.value));
    } else {
      setStatus([...status, e.target.value]);
    }
  };
  const handleChangeAccountStatus = (e) => {
    if (accountStatus.includes(e.target.value)) {
      setAccountStatus(accountStatus.filter((item) => item !== e.target.value));
    } else {
      setAccountStatus([...accountStatus, e.target.value]);
    }
  };
  const handleChangeVisibility = (e) => {
    if (visibility.includes(e.target.value)) {
      setVisibility(visibility.filter((item) => item !== e.target.value));
    } else {
      setVisibility([...visibility, e.target.value]);
    }
  };
  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setGrades([...["all"], ...GRADES.map((item) => item.toString())]);
    } else {
      setGrades([]);
    }
  };
  const handleFilter = () => {
    setFilter({
      ...filter,
      ...{
        grades,
        accountStatus,
        status,
        specialEd,
        schoolYear,
        visibility
      }
    });
    setExpand(false);
    const state = {
      ...filter,
      ...{
        grades,
        accountStatus,
        status,
        specialEd,
        schoolYear,
        visibility
      }
    };
    history.replace({...history.location, state});
  };
  const handleClear = () => {
    setGrades([]);
    setSpecialEd([]);
    setAccountStatus([]);
    setStatus([]);
    setSchoolYear([]);
    setVisibility([]);
    setFilter({});
    const state = {};
    history.replace({...history.location, state});
  };
  const renderGrades = () => map(GRADES, (grade, index) => {
    if (typeof grade !== "string") {
      return /* @__PURE__ */ React.createElement(FormControlLabel, {
        key: index,
        sx: {height: 30},
        control: /* @__PURE__ */ React.createElement(Checkbox, {
          checked: grades.includes(grade.toString()),
          value: grade,
          onChange: handleChangeGrades
        }),
        label: /* @__PURE__ */ React.createElement(Paragraph, {
          size: "large",
          fontWeight: "500",
          sx: {marginLeft: "12px"}
        }, `${toOrdinalSuffix(grade)} Grade`)
      });
    } else {
      return /* @__PURE__ */ React.createElement(FormControlLabel, {
        key: index,
        sx: {height: 30},
        control: /* @__PURE__ */ React.createElement(Checkbox, {
          checked: grades.includes(grade),
          value: grade,
          onChange: handleChangeGrades
        }),
        label: /* @__PURE__ */ React.createElement(Paragraph, {
          size: "large",
          fontWeight: "500",
          sx: {marginLeft: "12px"}
        }, grade)
      });
    }
  });
  const Filters2 = () => /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {textAlign: "left", marginY: "12px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    fontWeight: "700"
  }, "Grade Level"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "all",
      checked: grades.includes("all"),
      onChange: handleChangeAll
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Select All")
  }), renderGrades())), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    fontWeight: "700"
  }, "Grade Level"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "K",
      checked: grades.includes("K"),
      onChange: handleChangeGrades
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Kindergarten")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "1-8",
      checked: grades.includes("1-8"),
      onChange: handleChangeGrades
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "1-8")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "9-12",
      checked: grades.includes("9-12"),
      onChange: handleChangeGrades
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "9-12")
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    fontWeight: "700"
  }, "School Year"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "2021-2022",
      checked: schoolYear.includes("2021-2022"),
      onChange: handleChangeSchoolYear
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "2021-22")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "2022-2023",
      checked: schoolYear.includes("2022-2023"),
      onChange: handleChangeSchoolYear
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "2022-23")
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginTop: "12px"},
    size: "large",
    fontWeight: "700"
  }, "Special Ed"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "1",
      checked: specialEd.includes("1"),
      onChange: handleChangeSpecialEd
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "IEP")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "2",
      checked: specialEd.includes("2"),
      onChange: handleChangeSpecialEd
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "504")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "3",
      checked: specialEd.includes("3"),
      onChange: handleChangeSpecialEd
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Exit")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "0",
      checked: specialEd.includes("0"),
      onChange: handleChangeSpecialEd
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "None")
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginTop: "12px"},
    size: "large",
    fontWeight: "700"
  }, "Relation"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "1",
      checked: status.includes("1"),
      onChange: handleChangeStatus
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Sibling")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "0",
      checked: status.includes("0"),
      onChange: handleChangeStatus
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "New")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "2",
      checked: status.includes("2"),
      onChange: handleChangeStatus
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Returning")
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    fontWeight: "700"
  }, "Account Status"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "Verified",
      checked: accountStatus.includes("Verified"),
      onChange: handleChangeAccountStatus
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Verified")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "Unverified",
      checked: accountStatus.includes("Unverified"),
      onChange: handleChangeAccountStatus
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Unverified")
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginTop: "12px"},
    size: "large",
    fontWeight: "700"
  }, "Visibility"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "1",
      checked: visibility.includes("1"),
      onChange: handleChangeVisibility
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Hidden")
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    sx: {height: 30},
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: "0",
      checked: visibility.includes("0"),
      onChange: handleChangeVisibility
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large",
      fontWeight: "500",
      sx: {marginLeft: "12px"}
    }, "Unhiden")
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      justifyContent: "flex-end",
      display: "flex",
      height: "100%",
      alignItems: "end",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 2,
      textTransform: "none",
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      marginBottom: "12px",
      width: "140px"
    },
    onClick: handleFilter
  }, "Filter"), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 2,
      textTransform: "none",
      background: RED_GRADIENT,
      color: "white",
      width: "140px"
    },
    onClick: handleClear
  }, "Clear All"))));
  useEffect(() => {
    if (history.location && history.location.state) {
      const state = {...history.location.state};
      setGrades(state.grades || []);
      setSpecialEd(state.specialEd || []);
      setAccountStatus(state.accountStatus || []);
      setStatus(state.status || []);
      setSchoolYear(state.schoolYear || []);
      setVisibility(state.visibility || []);
      setFilter(state);
    }
  }, []);
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {marginTop: 2, padding: 2}
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    onClick: () => setExpand(!expand)
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    color: MTHBLUE,
    sx: {cursor: "pointer"}
  }, "Filter"), chevron()), expand && Filters2());
};
