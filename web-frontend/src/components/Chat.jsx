import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InitialView from "./InitialView";
import { useAuth } from "../firebase/AuthService.jsx";
import { chatLLMStreamWS } from "../server/sendMessage.js";
import WSConnection from "../utils/WSConnection";
import AudioService from "../utils/AudioService";
import Navbar from "./Navbar.jsx";
import { images } from "../../assets/images.js";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [audioMode, setAudioMode] = useState(false);
	const [inProgress, setInProgress] = useState(false);
	const { user } = useAuth();
	const messagesEndRef = useRef(null);
	const wsConnectionRef = useRef(null);
	const audioServiceRef = useRef(null);

	const setupWebSocket = async () => {
		if (user && !wsConnectionRef.current) {
			console.log("CONNECTING WS");
			const wsConnection = new WSConnection();
			await wsConnection.connect();
			const idToken = await user.getIdToken(false);
			await wsConnection.authenticate(idToken);
			wsConnectionRef.current = wsConnection;
			audioServiceRef.current = new AudioService(wsConnection);
			console.log("WebSocket connected and authenticated");
		}
	};

	useEffect(() => {
		setupWebSocket().catch(console.error);
		return () => {
			if (wsConnectionRef.current) {
				wsConnectionRef.current.close();
				wsConnectionRef.current = null;
			}
		};
	}, [user]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const messageLLM = async (message) => {
		await setupWebSocket(); // doesnt do anything theres already a ws connection
		setInProgress(true);
		let currentResponse = "";

		const onChunk = (respObj) => {
			const { data, result } = respObj;
			currentResponse += data;
			setMessages((prevMessages) => {
				const newMessages = [...prevMessages];
				const prevResult =
					newMessages[newMessages.length - 1]?.result || result;
				newMessages[newMessages.length - 1] = {
					text: currentResponse,
					isUser: false,
					result: prevResult || result,
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

	const toggleAudio = async () => {
		try {
			await setupWebSocket(); // Ensure WebSocket is set up

			if (!audioMode) {
				await audioServiceRef.current.startRecording();
				setAudioMode(true);
			} else {
				await audioServiceRef.current.stopRecording();
				setAudioMode(false);
			}
		} catch (err) {
			console.error("Error toggling audio mode:", err);
			setAudioMode(false);
		}
	};
	console.log(audioMode);
	return (
		<Flex direction="column" h="100vh" bg={"#FFDAD6"}>
			<Navbar />{" "}
			{messages.length === 0 ? (
				<Box
					flex={1}
					px={4}
					py={2}
					display={"flex"}
					justifyContent={"center"}
					flexDirection={"column"}
				>
					<Flex justify="center" mb={8}>
						<Flex>
							<Box width={"200px"}>
								<Image src={images.meddyChatLogo} alt="Dan Abramov" />
							</Box>
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
