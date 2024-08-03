import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
	return (
		<ChakraProvider theme={customTheme}>
			<Router>
				<AuthProvider>
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/chat" element={<Chat />} />
						<Route path="/EVI" element={<EVI />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/about" element={<AboutUsPage />} />
						<Route path="/privacy" element={<PrivacyPolicy />} />
						<Route path="/recommendations" element={<Recommendations />} />
						{/* <Route path="/team" element={<Team />} /> */}
					</Routes>
				</AuthProvider>
			</Router>
		</ChakraProvider>
	);
}

export default App;
