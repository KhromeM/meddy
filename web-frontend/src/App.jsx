import React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import Chat from "./components/Chat.jsx";
import "./styles/chat.css";
import { AuthProvider } from "./firebase/AuthService.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
	return (
		<ChakraProvider theme={theme}>
			<AuthProvider>
				<Navbar />
				<Chat />
			</AuthProvider>
		</ChakraProvider>
	);
}

export default App;
