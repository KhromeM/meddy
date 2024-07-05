import { useState, useRef, useEffect } from "react";
import { Box, VStack, Heading } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "../firebase/AuthService.jsx";
import { chatLLM, chatLLMStream } from "../server/LLM.js";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [inProgress, setInProgress] = useState(false);
	const responseBufferRef = useRef("");
	const updateIntervalRef = useRef(null);
	const { user } = useAuth();
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// const messageLLM = async (message) => {
	// 	try {
	// 		const response = await chatLLM(user, message);
	// 		addMessageFromLLM(response);
	// 	} catch (error) {
	// 		console.error("Error reaching LLM:", error);
	// 	} finally {
	// 		setInProgress(false);
	// 	}
	// };

	// const addMessageFromUser = (message) => {
	// 	setMessages((prevMessages) => [...prevMessages, message]);
	// 	setInProgress(true);
	// 	messageLLM(message);
	// };

	// const addMessageFromLLM = (response) => {
	// 	const message = { text: response, isUser: false };
	// 	setMessages((prevMessages) => [...prevMessages, message]);
	// };

	const messageLLM = async (message) => {
		setInProgress(true);
		let currentResponse = "";

		const onChunk = (chunk) => {
			currentResponse += chunk;
			setMessages((prevMessages) => {
				const newMessages = [...prevMessages];
				newMessages[newMessages.length - 1] = {
					text: currentResponse,
					isUser: false,
				};
				return newMessages;
			});
		};

		const onComplete = () => {
			setInProgress(false);
		};

		chatLLMStream(user, message, onChunk, onComplete);
	};

	const addMessageFromUser = (message) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: message.text, isUser: true },
			{ text: "", isUser: false },
		]);
		messageLLM(message);
	};

	if (!user) return <Heading> Login to Chat</Heading>;
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
				<MessageList
					messages={messages}
					messagesEndRef={messagesEndRef}
					inProgress={inProgress}
				/>
				<MessageInput onSend={addMessageFromUser} inProgress={inProgress} />
			</VStack>
		</Box>
	);
};

export default Chat;
