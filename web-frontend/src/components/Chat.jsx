import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, useColorModeValue, Image, Text } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InitialView from "./InitialView";
import { useAuth } from "../firebase/AuthService.jsx";
import { chatLLMStreamWS, openWebSocket } from "../server/LLM.js";
import MeddyIcon from "./MeddyIcon.jsx";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [inProgress, setInProgress] = useState(false);
	const { user } = useAuth();
	const messagesEndRef = useRef(null);
	const bgColor = useColorModeValue("linen", "gray.800");

	useEffect(() => {
		(async () => {
			await openWebSocket(user);
		})();
	}, [user]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

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

		chatLLMStreamWS(message, onChunk, onComplete);
	};

	const addMessageFromUser = (message) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: message.text, isUser: true },
			{ text: "", isUser: false },
		]);
		messageLLM(message);
	};

	return (
		<Flex direction="column" h="100vh" bg={"fef9ef"}>
			{messages.length === 0 ? (
				<Box flex={1} overflowY="auto" px={4} py={2}>
					<Flex justify="center" mb={8}>
						<Flex>
							<MeddyIcon boxSize="5rem" color="#843a06" />
							<Text textColor="#843a06" textAlign="center">
								{" "}
								{true ? "Listening..." : ""}
							</Text>
						</Flex>
					</Flex>
					<InitialView />
				</Box>
			) : (
				<Box flex={1} overflowY="auto" px={4} py={2}>
					<MessageList
						messages={messages}
						messagesEndRef={messagesEndRef}
						inProgress={inProgress}
					/>
				</Box>
			)}
			<MessageInput onSend={addMessageFromUser} inProgress={inProgress} />
		</Flex>
	);
};

export default Chat;
