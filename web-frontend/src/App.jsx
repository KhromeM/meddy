import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // Updated import
import { LandingPage } from "./components/LandingPage";
import Chat from "./components/Chat.jsx";
import "./styles/chat.css";
import { AuthProvider } from "./firebase/AuthService.jsx";
import customTheme from "./theme";
import { EVI } from "./components/EVI.jsx";
// import { Team } from "./components/Team.jsx";
import { Contact } from "./components/Contact.jsx";
import { AboutUsPage } from "./components/about.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import Recommendations from "./components/Recommendations.jsx";
import Health from "./components/Health.jsx";
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
            <Route path="/recommendations" component={Recommendations} />
            <Route path="/EVI" component={EVI} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={AboutUsPage} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/health" component={Health} />
            <Route path={`/dashboard`} component={AdminLayout} />
            {/* <Route path="/dashboard" component={Dashboard} />{" "} */}
            {/* <Route path="/voicemode" component={VoiceMode} />{" "} */}
            {/* Fixed duplicate path */}
            {/* <Route path="/team" component={Team} /> */}
          </Switch>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
