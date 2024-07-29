import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Message = ({ message, isStreaming }) => {
	const { text, isUser } = message;

	return (
		<Box
			alignSelf={isUser ? "flex-end" : "flex-start"}
			bg={isUser ? "white" : "#fff2e4"}
			p={3}
			borderRadius="lg"
			maxW="70%"
			borderWidth={1}
			borderColor="#843a06"
		>
			<Text>{text}</Text>
			{isStreaming && (
				<Text as="span" animation="blink 1s infinite">
					...
				</Text>
			)}
		</Box>
	);
};

export default Message;
