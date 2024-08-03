import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Container } from "@chakra-ui/react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import InitialView from "./InitialView";
import MeddyIcon from "./MeddyIcon.jsx";
import { useAuth } from "../firebase/AuthService.jsx";
import { chatLLMStreamWS } from "../server/sendMessage.js";
import WSConnection from "../utils/WSConnection";
import AudioService from "../utils/AudioService";
import Navbar from "./Navbar.jsx";
import { v4 as uuidv4 } from "uuid";

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

    setMessages((prevMessages) => {
      const lastUserMessageIndex = prevMessages.findLastIndex(
        (msg) => msg.source === "user" && msg.messageId === reqId
      );

      if (lastUserMessageIndex !== -1) {
        // Update existing transcription
        const updatedMessages = [...prevMessages];
        updatedMessages[lastUserMessageIndex] = {
          ...updatedMessages[lastUserMessageIndex],
          text: text,
          isComplete: message.isComplete,
        };
        return updatedMessages;
      } else {
        // Create new transcription message
        return [
          ...prevMessages,
          {
            messageId: reqId,
            source: "user",
            text: text,
            isAudio: true,
            time: new Date(),
            isComplete: message.isComplete,
          },
        ];
      }
    });
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

  const addMessageToChatHistory = (source, text, reqId) => {
    setMessages((prev) => [
      ...prev,
      { messageId: reqId, source, text, time: new Date() },
    ]);
  };

  const updateCurrentMessageChunk = (text, reqId) => {
    setMessages((prevMessages) => {
      const index = prevMessages.findIndex((msg) => msg.messageId === reqId);
      if (index === -1) return prevMessages;
      const updatedMessages = [...prevMessages];
      updatedMessages[index] = { ...updatedMessages[index], text: text || "" };
      return updatedMessages;
    });
  };

  const sendMessage = async (message) => {
    const reqId = uuidv4();
    addMessageToChatHistory("user", message, reqId + "_user");
    setInProgress(true);

    wsConnectionRef.current.send({
      type: "chat",
      data: { text: message, reqId },
    });
  };

  const toggleAudio = async () => {
    if (audioMode) {
      await audioServiceRef.current.stopRecording();
    } else {
      await audioServiceRef.current.startRecording();
    }
    setAudioMode(!audioMode);
  };

  return (
    <Flex direction="column" h="100vh" bg="#fef9ef">
      <Navbar />
      <Flex flex={1} direction="column" overflow="hidden">
        <Box flex={1} overflowY="auto">
          {messages.length === 0 ? (
            <Box px={4} py={2}>
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
            <Container maxW="container.xl" py={4} px={4}>
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="xl"
                h="full"
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Box flex={1} overflowY="auto" p={6}>
                  <MessageList
                    messages={messages}
                    messagesEndRef={messagesEndRef}
                    inProgress={inProgress}
                  />
                </Box>
              </Box>
            </Container>
          )}
        </Box>
        <Box
          borderTop="1px"
          borderColor="gray.200"
          p={4}
          bg={messages.length > 0 ? "white" : "transparent"}
          boxShadow={
            messages.length > 0 ? "0 -2px 10px rgba(0,0,0,0.05)" : "none"
          }
        >
          <Container
            maxW="container.md"
          >
            <MessageInput
              onSend={sendMessage}
              inProgress={inProgress}
              toggleAudio={toggleAudio}
              audioMode={audioMode}
            />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Chat;