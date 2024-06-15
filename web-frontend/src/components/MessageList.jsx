import { Box, VStack } from "@chakra-ui/react";
import Message from "./Message";

const MessageList = ({ messages, messagesEndRef }) => {
	return (
		<Box
			className="message-list"
			p={4}
			bg="gray.50"
			borderRadius="lg"
			overflowY="auto"
			maxH="50vh"
			w="100%"
		>
			<VStack spacing={4} align="stretch">
				{messages.map((msg, index) => (
					<Message key={index} message={msg} />
				))}
				<div ref={messagesEndRef}></div>
			</VStack>
		</Box>
	);
};

export default MessageList;