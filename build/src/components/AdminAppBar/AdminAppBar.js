import ChevronLeftIcon from "../../../_snowpack/pkg/@mui/icons-material/ChevronLeft.js";
import ChevronRightIcon from "../../../_snowpack/pkg/@mui/icons-material/ChevronRight.js";
import SearchIcon from "../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {AppBar as MUIAppBar, Avatar, Box, Grid, InputAdornment, OutlinedInput} from "../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import React, {useContext, useEffect, useRef, useState} from "../../../_snowpack/pkg/react.js";
import {useLocation} from "../../../_snowpack/pkg/react-router-dom.js";
import Slider from "../../../_snowpack/pkg/react-slick.js";
import {useRecoilState} from "../../../_snowpack/pkg/recoil.js";
import {UserContext, userRegionState} from "../../providers/UserContext/UserProvider.js";
import {MTHBLUE} from "../../utils/constants.js";
import {Metadata} from "../Metadata/Metadata.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
export const AdminAppBar = () => {
  const classes = useStyles;
  const {me, setMe} = useContext(UserContext);
  const location = useLocation();
  const sliderRef = useRef();
  const [seachField, setSearchField] = useState("");
  const [selected, setSelected] = useRecoilState(userRegionState);
  const isActive = (id) => location.pathname.includes(`homeroom/${id}`);
  function SampleNextArrow(props) {
    const {className, style, onClick} = props;
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        right: "-160px",
        top: "31%",
        width: "150px",
        height: "30px",
        position: "absolute",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(ChevronRightIcon, {
      style: {...style, display: "block", color: "black", background: "#FAFAFA", cursor: "pointer"},
      onClick: () => sliderRef.current?.slickNext()
    }));
  }
  function SamplePrevArrow(props) {
    const {className, style, onClick} = props;
    return /* @__PURE__ */ React.createElement(ChevronLeftIcon, {
      className,
      style: {...style, display: "block", color: "black", background: "#FAFAFA"},
      onClick: () => sliderRef.current.slickPrev()
    });
  }
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: /* @__PURE__ */ React.createElement(SampleNextArrow, null),
    prevArrow: /* @__PURE__ */ React.createElement(SamplePrevArrow, null)
  };
  useEffect(() => {
    if (me?.selectedRegionId == null) {
      handleRegionChange(me?.userRegion[0]);
    }
  }, []);
  const handleRegionChange = (region) => {
    setSelected(region);
    localStorage.setItem("selectedRegion", JSON.stringify(region));
    setMe((prev) => {
      return {
        ...prev,
        selectedRegionId: region.region_id
      };
    });
  };
  const renderRegionHeader = () => map(me?.userRegion, (region) => {
    return /* @__PURE__ */ React.createElement(Box, {
      sx: {textDecoration: "none", cursor: "pointer"},
      key: region?.regionDetail.id,
      onClick: () => handleRegionChange(region)
    }, /* @__PURE__ */ React.createElement(Metadata, {
      divider: true,
      title: /* @__PURE__ */ React.createElement(Subtitle, {
        color: isActive(region?.regionDetail.id) ? MTHBLUE : "#A1A1A1"
      }, region?.regionDetail.name),
      subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
        color: "#cccccc",
        size: "large"
      }, region?.regionDetail.program),
      image: /* @__PURE__ */ React.createElement(Box, {
        sx: {position: "relative"}
      }, /* @__PURE__ */ React.createElement(Avatar, {
        alt: region?.regionDetail.name,
        src: region?.regionDetail?.state_logo,
        variant: "rounded",
        style: {marginRight: 24}
      }), /* @__PURE__ */ React.createElement(Box, {
        sx: {
          position: "absolute",
          bottom: -16,
          left: 0,
          width: "65%",
          height: 2,
          borderBottom: region.region_id === selected?.region_id ? "2px solid #4145FF" : 0
        }
      }))
    }));
  });
  return /* @__PURE__ */ React.createElement(MUIAppBar, {
    position: "static",
    sx: classes.appBar,
    elevation: 0
  }, /* @__PURE__ */ React.createElement("div", {
    style: classes.toolbar
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "space-between",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(OutlinedInput, {
    size: "small",
    style: {fontSize: 12},
    fullWidth: true,
    value: seachField,
    placeholder: "Search Person, Email, or Phone Number",
    onChange: (e) => setSearchField(e.target.value),
    startAdornment: /* @__PURE__ */ React.createElement(InputAdornment, {
      position: "start"
    }, /* @__PURE__ */ React.createElement(SearchIcon, {
      fontSize: "small",
      style: {color: "black"}
    }))
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 1
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 7
  }, /* @__PURE__ */ React.createElement(Slider, {
    ...settings,
    ref: sliderRef
  }, renderRegionHeader())))));
};
