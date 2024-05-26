import React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import Chat from "./components/Chat.jsx";
import "./styles/chat.css";

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Box>
				<Chat />
			</Box>
		</ChakraProvider>
	);
}

export default App;
