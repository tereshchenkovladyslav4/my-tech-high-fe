import {useQuery} from "../../_snowpack/pkg/@apollo/client.js";
import React, {useContext, useEffect, useState} from "../../_snowpack/pkg/react.js";
import {AdminAppBar} from "../components/AdminAppBar/AdminAppBar.js";
import {AppBar} from "../components/AppBar/AppBar.js";
import {Flexbox} from "../components/Flexbox/Flexbox.js";
import {AdminSideMenu} from "../components/SideMenu/AdminSideMenu.js";
import {SideMenu} from "../components/SideMenu/SideMenu.js";
import {TabContext, UserContext} from "../providers/UserContext/UserProvider.js";
import {AdminRoutes} from "../router/AdminRoutes.js";
import {Routes} from "../router/Routes.js";
import {UnauthenticatedRoutes} from "../router/UnauthenticatedRoutes.js";
import {LoadingScreen} from "../screens/LoadingScreen/LoadingScreen.js";
import {getMeQuery} from "./services.js";
export const Root = () => {
  const {me, setMe} = useContext(UserContext);
  const {setTab, setVisitedTabs} = useContext(TabContext);
  const {loading, error, data} = useQuery(getMeQuery);
  const [isSuper, setIsSuper] = useState(null);
  useEffect(() => {
    if (!loading && me === null && data !== void 0) {
      setTab({
        currentTab: 0
      });
      setMe(data.me);
      setVisitedTabs([]);
      setIsSuper(Number(data.me?.level) === 1);
    }
  }, [loading]);
  return loading ? /* @__PURE__ */ React.createElement(LoadingScreen, null) : me !== null ? !isSuper ? /* @__PURE__ */ React.createElement(Flexbox, {
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(SideMenu, null), /* @__PURE__ */ React.createElement(Flexbox, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "260px"}
  }, me?.level === 2 ? /* @__PURE__ */ React.createElement(AdminAppBar, null) : /* @__PURE__ */ React.createElement(AppBar, null), /* @__PURE__ */ React.createElement(Routes, null)))) : /* @__PURE__ */ React.createElement(Flexbox, {
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(AdminSideMenu, null), /* @__PURE__ */ React.createElement(Flexbox, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "260px"}
  }, /* @__PURE__ */ React.createElement(AdminAppBar, null), /* @__PURE__ */ React.createElement(AdminRoutes, null)))) : /* @__PURE__ */ React.createElement(UnauthenticatedRoutes, null);
};
