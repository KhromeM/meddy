import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import Chat from "./components/Chat.jsx";
import "./styles/chat.css";
import { AuthProvider } from "./firebase/AuthService.jsx";
import customTheme from "./theme";
import { EVI } from "./components/EVI.jsx";
import { Team } from "./components/Team.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId } from "./utils/Info";

function App() {
	return (
		<GoogleOAuthProvider clientId={googleClientId}>
			<ChakraProvider theme={customTheme}>
				<Router>
					<AuthProvider>
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/chat" element={<Chat />} />
							<Route path="/EVI" element={<EVI />} />
							<Route path="/team" element={<Team />} />
						</Routes>
					</AuthProvider>
				</Router>
			</ChakraProvider>
		</GoogleOAuthProvider>
	);
}

export default App;
