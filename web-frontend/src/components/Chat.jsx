import React, { useState } from "react";
import { Box, VStack, Heading } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const Chat = () => {
	const [messages, setMessages] = useState([]);

	const addMessage = (message) => {
		setMessages([...messages, message]);
	};

	return (
		<Box
			className="chat-container"
			p={4}
			maxW="lg"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			bg="white"
			boxShadow="lg"
		>
			<Heading as="h1" size="lg" mb={4} textAlign="center" color="teal.500">
				Chat Application
			</Heading>
			<VStack spacing={4}>
				<MessageList messages={messages} />
				<MessageInput onSend={addMessage} />
			</VStack>
		</Box>
	);
};

export default Chat;
