import React, { useEffect, useState, useRef } from "react";
import {
	Box,
	Flex,
	Text,
	VStack,
	HStack,
	IconButton,
	useToast,
	Avatar,
	Center,
} from "@chakra-ui/react";
// import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useAuth } from "../../../firebase/AuthService.jsx";
import WSConnection from "../../../utils/WSConnection.js";
import AudioService from "../../../utils/AudioService.js";
import { motion, AnimatePresence } from "framer-motion";
// import {getChatHistory} from "../../server/sendMessage.js"
import notActiveMic from "../../../../assets/notactive.png";
import activeMic from "../../../../assets/active.gif";
import CustomStarfield from "../../../components/Background/Starfield.jsx";

const VoiceMode = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [userMessage, setUserMessage] = useState("");
	const [aiResponse, setAiResponse] = useState("");
	const [currentTranscription, setCurrentTranscription] = useState("");
	const [showIntro, setShowIntro] = useState(true);
	const [showMic, setShowMic] = useState(false);
	const { user } = useAuth();
	const wsConnectionRef = useRef(null);
	const audioServiceRef = useRef(null);
	const toast = useToast();

	useEffect(() => {
		setupWebSocket().catch(console.error);
		const introTimer = setTimeout(() => {
			setShowIntro(false);
			setShowMic(true);
		}, 3000);

		return () => {
			if (wsConnectionRef.current) {
				wsConnectionRef.current.close();
				wsConnectionRef.current = null;
			}
			clearTimeout(introTimer);
		};
	}, [user]);

	const setupWebSocket = async () => {
		if (user && !wsConnectionRef.current) {
			const wsConnection = new WSConnection();
			await wsConnection.connect();
			const idToken = await user.getIdToken(false);
			await wsConnection.authenticate(idToken);
			wsConnectionRef.current = wsConnection;
			audioServiceRef.current = new AudioService(
				wsConnection,
				handleAudioResponse
			);

			wsConnection.setHandler("chat_response", handleChatResponse);
			wsConnection.setHandler("partial_transcript", handleTranscription);
			wsConnection.setHandler("audio_3", (message) => {
				if (message.audio) {
					audioServiceRef.current.addToQueue(
						3,
						message.audio,
						message.isComplete
					);
				}
			});
		}
	};

	const handleChatResponse = (message) => {
		setAiResponse((prev) => prev + message.data);
	};

	const handleTranscription = (message) => {
		if (message.isComplete) {
			setUserMessage((prev) => prev + " " + message.data);
			setCurrentTranscription("");
		} else {
			setCurrentTranscription((prev) => prev + " " + message.data);
		}
	};

	const handleAudioResponse = (audioChunk, queueNumber, isComplete) => {
		setAudioMessages((prevMessages) => {
			const lastLLMMessageIndex = prevMessages.findLastIndex(
				(msg) => msg.queueNumber === queueNumber
			);

			if (lastLLMMessageIndex !== -1) {
				const updatedMessages = [...prevMessages];
				const lastLLMMessage = updatedMessages[lastLLMMessageIndex];

				updatedMessages[lastLLMMessageIndex] = {
					...lastLLMMessage,
					audioChunks: [...(lastLLMMessage.audioChunks || []), audioChunk],
					isAudio: true,
					queueNumber: queueNumber,
					isComplete: isComplete,
				};

				return updatedMessages;
			} else {
				return [
					...prevMessages,
					{
						messageId: uuidv4(),
						isAudio: true,
						audioChunks: [audioChunk],
						queueNumber: queueNumber,
						isComplete: isComplete,
					},
				];
			}
		});
	};

	const toggleRecording = async () => {
		if (isRecording) {
			await stopRecording();
		} else {
			await startRecording();
		}
	};

	const startRecording = async () => {
		if (!wsConnectionRef.current || !audioServiceRef.current) {
			toast({
				title: "Error",
				description: "Connection not established. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			await audioServiceRef.current.startRecording();
			setIsRecording(true);
			setCurrentTranscription("");
			setUserMessage("");
			setAiResponse("");
		} catch (error) {
			console.error("Error starting recording:", error);
			toast({
				title: "Error",
				description:
					"Failed to start recording. Please check your microphone permissions.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const glowStyle = {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		filter: "blur(4px)",
		opacity: 0.1,
	};

	const stopRecording = async () => {
		if (audioServiceRef.current) {
			await audioServiceRef.current.stopRecording();
		}
		setIsRecording(false);
	};

	const ChatBubble = ({ message, isUser }) => (
		<Flex justify="center" mb={4} direction={isUser ? "row-reverse" : "row"}>
			<Avatar
				src={isUser ? user?.photoURL : "/assets/meddyLogo.png"}
				size="sm"
				mr={isUser ? 0 : 2}
				ml={isUser ? 2 : 0}
			/>
			<Box
				maxW="70%"
				bg={isUser ? "blue.300" : "gray.700"}
				color="white"
				borderRadius="xl"
				p={4}
			>
				<Text>{message}</Text>
			</Box>
		</Flex>
	);

	const WaveAnimation = () => (
		<Flex justify="center" align="center" h="60px">
			{[...Array(5)].map((_, i) => (
				<motion.div
					key={i}
					animate={{
						y: [0, -30, 0],
					}}
					transition={{
						duration: 0.5,
						repeat: Infinity,
						repeatType: "reverse",
						delay: i * 0.1,
					}}
				>
					<Box
						w="70px"
						h="100px"
						bg="white"
						mx={1}
						borderRadius="full"
						mb={4}
					/>
				</motion.div>
			))}
		</Flex>
	);

	return (
		<Box bg="black" h="100vh" color="white" overflow="hidden">
			<CustomStarfield />
			<AnimatePresence>
				{showIntro && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}
					>
						<Text fontSize="2xl" fontWeight="bold" textAlign="center">
							Entering Meddy Voice Mode...
						</Text>
					</motion.div>
				)}
			</AnimatePresence>

			{!showIntro && (
				<Flex direction="column" h="100vh" justify="center" p={4}>
					<VStack spacing={7} align="center">
						{aiResponse && <ChatBubble message={aiResponse} isUser={false} />}

						<Center flexDirection="column">
							<Box h="60px" mb={5}>
								{isRecording ? <WaveAnimation /> : null}
							</Box>
							{isRecording && currentTranscription ? (
								<Box
									mt="200"
									w="50vw"
									minW={"400"}
									bg="gray.700"
									p="6"
									borderRadius="10"
								>
									<Text
										fontSize="xl"
										textAlign="center"
										color="white"
										fontWeight={600}
									>
										{currentTranscription}
									</Text>
								</Box>
							) : (
								<></>
							)}
						</Center>

						{userMessage && <ChatBubble message={userMessage} isUser={true} />}
						{/* {isRecording && (
							<Box
								position="absolute"
								top="87%"
								left="50%"
								transform="translate(-50%, -50%)"
								bg="whiteAlpha.800"
								p={4}
								borderRadius="md"
								boxShadow="md"
								textAlign="center"
							>
								<Text fontSize="md" color="gray.700">
									Tap the bubble again to send
								</Text>
							</Box>
						)} */}
						<Box
							mt="5"
							as={motion.div}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							cursor="pointer"
							onClick={toggleRecording}
						>
							{isRecording ? (
								<img
									src={activeMic}
									alt="Active Microphone"
									width="200"
									height="200"
								/>
							) : (
								<img
									src={notActiveMic}
									alt="Inactive Microphone"
									width="200"
									height="200"
								/>
							)}
						</Box>
					</VStack>
				</Flex>
			)}
		</Box>
	);
};

export default VoiceMode;
