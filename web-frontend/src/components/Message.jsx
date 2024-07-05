import { Box, Text, Image } from "@chakra-ui/react";

const Message = ({ message, isStreaming }) => {
	const { text, image, isUser } = message;

	return (
		<Box
			className={`message ${isUser ? "user" : "bot"}`}
			bg={isUser ? "blue.100" : "gray.100"}
			p={3}
			borderRadius="md"
			alignSelf={isUser ? "flex-end" : "flex-start"}
			maxW="70%"
			my={2}
			boxShadow="md"
		>
			{text && (
				<Text transition="all 0.1s ease-out" opacity={isStreaming ? 0.7 : 1}>
					{text}
				</Text>
			)}
			{image && <Image src={image} alt="chat" mt={2} borderRadius="md" />}
			{isStreaming && (
				<Text as="span" animation="blink 1s infinite">
					...
				</Text>
			)}
		</Box>
	);
};

export default Message;
