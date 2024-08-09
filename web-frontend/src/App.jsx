import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // Updated import
import { LandingPage } from "./components/LandingPage";
import Chat from "./components/Chat.jsx";
import AudioChat from "./components/AudioChat.jsx";
import "./styles/chat.css";
import { AuthProvider } from "./firebase/AuthService.jsx";
import customTheme from "./theme";
import { EVI } from "./components/EVI.jsx";
// import { Team } from "./components/Team.jsx";
import { Contact } from "./components/Contact.jsx";
import { AboutUsPage } from "./components/about.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import Health from "./components/Health.jsx"
import Dashboard from "./layouts/Admin";
import VoiceMode from "./views/Dashboard/MeddyVoiceMode";

import AdminLayout from "./layouts/Admin"; 

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <Router>
        <AuthProvider>
          <Switch>
            {" "}
            {/* Changed from Routes to Switch */}
            <Route exact path="/" component={LandingPage} />{" "}
            {/* Changed element to component */}
            {/* Commented out Chat and Recommendations */}
            <Route path="/chat" component={Chat} />
            <Route path="/audiochat" component={AudioChat} />
            <Route path="/EVI" component={EVI} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={AboutUsPage} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/health" component={Health} />
            {/* @ Meddy team. This is where the new UI layout with the side navigation bar is. /dashboard */}
            {/* PATHS ARE IN src/routes.jsx . Not hard to figure out. */}
            <Route path={`/dashboard`} component={AdminLayout} />
            {/*  */}
            {/* <Route path="/team" component={Team} /> */}
          </Switch> 
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
