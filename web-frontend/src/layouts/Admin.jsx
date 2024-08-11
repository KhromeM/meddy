// Chakra imports
import { ChakraProvider, Portal, useDisclosure } from "@chakra-ui/react";
// import Configurator from "../components/Configurator/Configurator";
import Footer from "../components/Footer/Footer";
// Layout components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar";
import React, { createContext, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import routes from "../routes.jsx";
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
// Custom Chakra theme
import theme from "../theme/theme.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin";
// Custom components
import MainPanel from "../components/Layout/MainPanel";
import PanelContainer from "../components/Layout/PanelContainer";
import PanelContent from "../components/Layout/PanelContent";
// Meddy Add fade in
import "./Admin.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import SettingsPopout from "../components/SettingsPopout/SettingsPopout.jsx";

export const SettingsContext = createContext();

export default function Dashboard(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const location = useLocation();
  const { ...rest } = props;
  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].views);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar;
          }
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.category === "account") {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/dashboard") {
        // meddy william pathing prev /admin

        return (
          <Route
            path={prop.layout + prop.path}
            // path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  // console.log(getRoutes(routes));
  // Chakra Color Mode
  return (
    <ChakraProvider theme={theme} resetCss={false}>
      <Sidebar
        routes={routes}
        logoText={"Meddy"}
        display="none"
        sidebarVariant={sidebarVariant}
        onOpen={onOpen}
        {...rest}
      />
      <MainPanel
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
        minH="100vh"
        br={10}
        backgroundColor={
          location.pathname.includes("chat") ? "#FAF3EA" : "#f3ddcb"
          //   "#f3ddcb"
        }
        zIndex={-5}
      >
        <Portal>
          {/* Navbar for Meddy */}
          <AdminNavbar
            // onOpen={onOpen}
            logoText={"Meddy"}
            brandText={getActiveRoute(routes)}
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            {...rest}
          />
        </Portal>
        {/* MAIN CONTENT MEDDY */}
        {getRoute() ? (
          <PanelContent>
            <PanelContainer>
              {/* <TransitionGroup> */}
              {/*
						  This is no different than other usage of
						  <CSSTransition>, just make sure to pass
						  `location` to `Switch` so it can match
						  the old location as it animates out.
						*/}
              {/* <CSSTransition key={location.pathname} classNames="fade"> */}
              <Switch
              // location={location}
              >
                {/* Main Body Logic for Meddy */}
                <SettingsContext.Provider value={onOpen}>
                  {getRoutes(routes)}
                </SettingsContext.Provider>
                {/* <div>Nothing rendering bro.</div> */}
                {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
              </Switch>
              {/* </CSSTransition>
              </TransitionGroup> */}
            </PanelContainer>
          </PanelContent>
        ) : (
          <div>No routes.</div>
        )}
        {/* <Footer /> */}
        <Portal>
          {/* Gear Icon for Meddy */}
          {/* <FixedPlugin secondary={getActiveNavbar(routes)} fixed={fixed} onOpen={onOpen} />   */}
        </Portal>
        {/* Right sidebar settings popout for Meddy */}
        <SettingsPopout
          secondary={getActiveNavbar(routes)}
          isOpen={isOpen}
          onClose={onClose}
          isChecked={fixed}
          onSwitch={(value) => {
            setFixed(value);
          }}
          onOpaque={() => setSidebarVariant("opaque")}
          onTransparent={() => setSidebarVariant("transparent")}
        />
      </MainPanel>
    </ChakraProvider>
  );
}
