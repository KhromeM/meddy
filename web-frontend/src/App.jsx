import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import Chat from "./components/Chat.jsx";
import "./styles/chat.css";
import { AuthProvider } from "./firebase/AuthService.jsx";
import Navbar from "./components/Navbar.jsx";
import customTheme from "./theme";
import ReactFluidCursor from "./components/ReactFluidCursor/ReactFluidCursor.jsx";
function App() {
	return (
		<ChakraProvider theme={customTheme}>
			<Router>
				<AuthProvider>
					<Routes>
						<Route
							path="/"
							element={
								<>
									{/* <ReactFluidCursor /> */}
									<LandingPage />{" "}
								</>
							}
						/>
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
	);
}

export default App;
