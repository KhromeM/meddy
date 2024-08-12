import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Container, useToast } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InitialView from "./InitialView";
import MeddyIcon from "./MeddyIcon.jsx";
import { useAuth } from "../firebase/AuthService.jsx";
import WSConnection from "../utils/WSConnection";
import AudioService from "../utils/AudioService";
import Navbar from "./Navbar.jsx";
import { v4 as uuidv4 } from "uuid";
import { uploadImage, getImage } from "../server/imageHandler.js";
import { getChatHistory } from "../server/sendMessage.js";
import SpinningLogo from "./SpinningLogo.jsx";

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [audioMode, setAudioMode] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [imageUploaded, setImageUploaded] = useState();
  const [currentTranscription, setCurrentTranscription] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const wsConnectionRef = useRef(null);
  const audioServiceRef = useRef(null);
  let _currResult = useRef(null);
  const toast = useToast();

  const setupWebSocket = async () => {
    if (user && !wsConnectionRef.current) {
      console.log("CONNECTING WS");
      const wsConnection = new WSConnection();
      await wsConnection.connect();
      const idToken = await user.getIdToken(false);
      await wsConnection.authenticate(idToken);
      wsConnectionRef.current = wsConnection;
      audioServiceRef.current = new AudioService(
        wsConnection,
        handleAudioResponse
      );
      console.log("WebSocket connected and authenticated");

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
      wsConnection.setHandler("audio_1", (message) => {
        if (message.audio) {
          audioServiceRef.current.addToQueue(
            1,
            message.audio,
            message.isComplete
          );
        }
      });
    }
  };

  const chatHistory = async () => {
    if (user) {
      const chatHistory = (await getChatHistory(user)) || [];
      if (chatHistory.length > 0) setMessages(chatHistory);
    }
  };

  useEffect(() => {
    chatHistory();
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

  const handleChatResponse = (message) => {
    const reqId = message.reqId + "_llm";
    const text = message.data;

    setMessages((prevMessages) => {
      const lastLLMMessageIndex = prevMessages.findLastIndex(
        (msg) => msg.source === "llm" && msg.messageId === reqId
      );

      if (lastLLMMessageIndex !== -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[lastLLMMessageIndex] = {
          ...updatedMessages[lastLLMMessageIndex],
          text: (updatedMessages[lastLLMMessageIndex].text || "") + text,
          isComplete: message.isComplete,
        };
        return updatedMessages;
      } else {
        return [
          ...prevMessages,
          {
            messageId: reqId,
            source: "llm",
            text: text,
            time: new Date(),
            isComplete: message.isComplete,
          },
        ];
      }
    });

    if (message.isComplete) {
      setInProgress(false);
    }
  };

  const handleTranscription = (message) => {
    const reqId = message.reqId + "_user";
    const text = message.data;

    setCurrentTranscription((prev) => {
      if (!prev || prev.reqId !== reqId) {
        return { reqId, text };
      }
      return { ...prev, text: prev.text + " " + text };
    });

    if (message.isComplete) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          messageId: reqId,
          source: "user",
          text: currentTranscription
            ? currentTranscription.text + " " + text
            : text,
          time: new Date(),
          isComplete: true,
        },
      ]);
      setCurrentTranscription(null);
    }
  };

  const handleAudioResponse = (audioChunk, queueNumber, isComplete) => {
    setMessages((prevMessages) => {
      const lastLLMMessageIndex = prevMessages.findLastIndex(
        (msg) => msg.source === "llm" && msg.queueNumber === queueNumber
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
            source: "llm",
            text: "",
            isAudio: true,
            audioChunks: [audioChunk],
            queueNumber: queueNumber,
            isComplete: isComplete,
            time: new Date(),
          },
        ];
      }
    });
  };

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  const sendMessage = async (message) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const text = message.text;
    const reqId = uuidv4();
    const imageid = message.imageName;
    setMessages((prev) => [
      ...prev,
      {
        messageId: reqId + "_user",
        source: "user",
        text,
        imageid,
        time: new Date(),
      },
    ]);
    setInProgress(true);
    setImageUploaded(null);

    wsConnectionRef.current.send({
      type: "chat",
      data: { text: text, reqId, image: message?.imageName },
    });
  };

  const uploadFile = async (file) => {
    const response = await uploadImage(file, user);
    if (response.status === 200) {
      imageUploadResponse(file);
    }
  };

  const imageUploadResponse = async (file) => {
    const response = await getImage(file, user);
    if (response.status == 200) {
      setImageUploaded(response.data);
    }
  };

  const toggleAudio = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use voice input.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (audioMode) {
      await audioServiceRef.current.stopRecording();
    } else {
      await audioServiceRef.current.startRecording();
    }
    setAudioMode(!audioMode);
  };

  return (
    <Flex
      //   marginTop="60px"
      // paddingTop="60px"
      direction="column"
      h="95vh"
      bg="fef9ef"
      //   overflow="hidden"
    >
      <Box flex={1} display="flex" flexDirection="column">
        {messages.length === 0 ? (
          <Box flex={1} px={4} py={2} overflowY="auto">
            <Flex justify="center" mb={8} pt={8}>
              {" "}
              {/* Added pt={8} for top padding */}
              <Flex flexDirection="column" alignItems="center">
                {" "}
                {/* Changed to column layout */}
                <SpinningLogo
                  size={60}
                  outerSpeed={10}
                  innerSpeed={8}
                  outerCircleSize={1.2}
                  innerCircleSize={0.8}
                  color="#843a06"
                />
                <Text textColor="#843a06" textAlign="center" mt={2}>
                  {" "}
                  {/* Added mt={2} for spacing */}
                  {audioMode ? "Listening..." : ""}
                </Text>
              </Flex>
            </Flex>
            <InitialView />
          </Box>
        ) : (
          <Box flex={1} overflowY="auto">
            <Container maxW="container.xl" h="full" py={0}>
              <Box
                bg="#FAF3EA"
                h="full"
                // overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Box
                  flex={1}
                  overflowY="auto"
                  p={10}
                  maxHeight="88vh"
                  css={{
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    "-ms-overflow-style": "none",
                    scrollbarWidth: "none",
                  }}
                >
                  <MessageList
                    messages={messages}
                    messagesEndRef={messagesEndRef}
                    inProgress={inProgress}
                    currentTranscription={currentTranscription}
                  />
                </Box>
              </Box>
            </Container>
          </Box>
        )}
        <Box>
          <MessageInput
            onSend={sendMessage}
            onUpload={uploadFile}
            handleDeleteImage={() => setImageUploaded(null)}
            inProgress={inProgress}
            toggleAudio={toggleAudio}
            audioMode={audioMode}
            imageUploaded={imageUploaded}
            prompt={props.location.state?.prompt || ""}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default Chat;
