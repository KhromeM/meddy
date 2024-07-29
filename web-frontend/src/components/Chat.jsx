import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InitialView from "./InitialView";
import { useAuth } from "../firebase/AuthService.jsx";
import { chatLLMStreamWS } from "../server/sendMessage.js";
import MeddyIcon from "./MeddyIcon.jsx";
import WSConnection from "../utils/WSConnection";
import AudioService from "../utils/AudioService";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [audioMode, setAudioMode] = useState(false);
	const [inProgress, setInProgress] = useState(false);
	const { user } = useAuth();
	const messagesEndRef = useRef(null);
	const wsConnectionRef = useRef(null);
	const audioServiceRef = useRef(null);

	useEffect(() => {
		const setupWebSocket = async () => {
			if (user && !wsConnectionRef.current) {
				const wsConnection = new WSConnection();
				await wsConnection.connect();
				const idToken = await user.getIdToken(false);
				await wsConnection.authenticate(idToken);
				wsConnectionRef.current = wsConnection;
				audioServiceRef.current = new AudioService(wsConnection);
				console.log("WebSocket connected and authenticated");
			}
		};

		setupWebSocket().catch(console.error);

		return () => {
			if (wsConnectionRef.current) {
				wsConnectionRef.current.close();
				wsConnectionRef.current = null;
			}
		};
	}, [user]);
	useEffect(() => {
		if (wsConnectionRef.current) {
			wsConnectionRef.current.setHandler("audio_3", (message) => {
				audioServiceRef.current.queueAudioChunk(message.audio);
			});
		}
	}, [wsConnectionRef, audioServiceRef]);

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

		await chatLLMStreamWS(
			wsConnectionRef.current,
			message,
			onChunk,
			onComplete
		);
	};

	const addMessageFromUser = (message) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: message.text, isUser: true },
			{ text: "", isUser: false },
		]);
		messageLLM(message);
	};

	const toggleAudio = () => {
		setAudioMode((prevMode) => {
			const newMode = !prevMode;
			if (newMode) {
				audioServiceRef.current.startRecording();
			} else {
				audioServiceRef.current.stopRecording();
			}
			return newMode;
		});
	};

	return (
		<Flex direction="column" h="100vh" bg={"fef9ef"}>
			{messages.length === 0 ? (
				<Box flex={1} overflowY="auto" px={4} py={2}>
					<Flex justify="center" mb={8}>
						<Flex>
							<MeddyIcon boxSize="5rem" color="#843a06" />
							<Text textColor="#843a06" textAlign="center">
								{audioMode ? "Listening..." : ""}
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
			<MessageInput
				onSend={addMessageFromUser}
				inProgress={inProgress}
				toggleAudio={toggleAudio}
				audioMode={audioMode}
			/>
		</Flex>
	);
};

export default Chat;
