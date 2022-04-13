import React, {useEffect, useState} from "../_snowpack/pkg/react.js";
import ThemeProvider from "../_snowpack/pkg/@mui/system/ThemeProvider.js";
import {theme} from "./utils/theme.js";
import {CssBaseline} from "../_snowpack/pkg/@mui/material.js";
import {BrowserRouter as Router} from "../_snowpack/pkg/react-router-dom.js";
import WebFont from "../_snowpack/pkg/webfontloader.js";
import {TabContext, UserContext} from "./providers/UserContext/UserProvider.js";
import {Root} from "./root/Root.js";
import {ApolloProvider} from "./providers/ApolloProvider/ApolloProvider.js";
import {AuthProvider} from "./providers/AuthProvider/AuthProvider.js";
import {ProfileProvider} from "./providers/ProfileProvider/ProfileProvider.js";
import {RecoilRoot} from "../_snowpack/pkg/recoil.js";
import {UserLeaveConfirmation} from "./components/UserLeaveConfirmation/UserLeaveConfirmation.js";
export const App = () => {
  const [me, setMe] = useState(null);
  const [tab, setTab] = useState(null);
  const [visitedTabs, setVisitedTabs] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(true);
  const userContext = React.useMemo(() => ({
    me,
    setMe
  }), [me]);
  const tabContext = React.useMemo(() => ({
    tab,
    setTab,
    visitedTabs,
    setVisitedTabs
  }), [tab, visitedTabs]);
  useEffect(() => {
    WebFont.load({
      custom: {
        families: ["VisbyCF"],
        urls: ["/src/fonts.css"]
      }
    });
  }, []);
  return /* @__PURE__ */ React.createElement(Router, {
    getUserConfirmation: (message, callback) => {
      return UserLeaveConfirmation(message, callback, confirmOpen, setConfirmOpen);
    }
  }, /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme
  }, /* @__PURE__ */ React.createElement(AuthProvider, null, /* @__PURE__ */ React.createElement(ApolloProvider, null, /* @__PURE__ */ React.createElement(UserContext.Provider, {
    value: userContext
  }, /* @__PURE__ */ React.createElement(TabContext.Provider, {
    value: tabContext
  }, /* @__PURE__ */ React.createElement(ProfileProvider, null, /* @__PURE__ */ React.createElement(CssBaseline, null), /* @__PURE__ */ React.createElement(RecoilRoot, null, /* @__PURE__ */ React.createElement(Root, null)))))))));
};
