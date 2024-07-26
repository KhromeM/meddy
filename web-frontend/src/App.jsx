import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import Chat from "./components/Chat.jsx";
import "./styles/chat.css";
import { AuthProvider } from "./firebase/AuthService.jsx";
import Navbar from "./components/Navbar.jsx";
import customTheme from "./theme";
import CursorEffect from "./components/CursorEffect.jsx";
import { StoreProvider } from "./StoreState.jsx";

function App() {
	return (
		<StoreProvider>
			<ChakraProvider theme={customTheme}>
				<Router>
					<AuthProvider>
						{/* <CursorEffect /> */}

						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route
								path="/chat"
								element={
									<>
										<Navbar />
										<Chat />
									</>
								}
							/>
						</Routes>
					</AuthProvider>
				</Router>
			</ChakraProvider>
		</StoreProvider>
	);
}

export default App;
