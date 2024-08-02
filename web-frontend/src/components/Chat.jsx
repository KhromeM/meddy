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
import Navbar from "./Navbar.jsx";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [audioMode, setAudioMode] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [messageBuffer, setMessageBuffer] = useState({});
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

    setMessageBuffer((prev) => {
      const updatedBuffer = { ...prev };
      if (!updatedBuffer[reqId]) {
        addMessageToChatHistory("llm", "", reqId);
        updatedBuffer[reqId] = [];
      }
      updatedBuffer[reqId] = [...updatedBuffer[reqId], text];

      const fullMessage = updatedBuffer[reqId].join("");
      updateCurrentMessageChunk(fullMessage, reqId);

      return updatedBuffer;
    });

    if (message.isComplete) {
      setMessageBuffer((prev) => {
        const { [reqId]: _, ...rest } = prev;
        return rest;
      });
      setInProgress(false);
    }
  };

  const handleTranscription = (message) => {
    const reqId = message.reqId + "_user";
    const text = message.data;

    setMessageBuffer((prev) => {
      const updatedBuffer = { ...prev };
      if (!updatedBuffer[reqId]) {
        addMessageToChatHistory("user", text, reqId);
        updatedBuffer[reqId] = [text];
      } else {
        updatedBuffer[reqId] = [...updatedBuffer[reqId], text];
        const fullMessage = updatedBuffer[reqId].join(" ");
        updateCurrentMessageChunk(fullMessage, reqId);
      }
      return updatedBuffer;
    });

    if (message.isComplete) {
      setMessageBuffer((prev) => {
        const { [reqId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleAudioResponse = (audioChunk, queueNumber, isComplete) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (
        lastMessage &&
        lastMessage.source === "llm" &&
        lastMessage.isAudio &&
        lastMessage.queueNumber === queueNumber
      ) {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          audioChunks: [...(lastMessage.audioChunks || []), audioChunk],
          isComplete: isComplete,
        };
        return updatedMessages;
      } else if (audioChunk) {
        // Only want to create a new message if there's actual audio content
        return [
          ...prevMessages,
          {
            messageId: uuidv4(),
            source: "llm",
            isAudio: true,
            audioChunks: [audioChunk],
            queueNumber: queueNumber,
            isComplete: isComplete,
            time: new Date(),
          },
        ];
      }
      return prevMessages;
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
    <Flex direction="column" h="100vh" bg="fef9ef">
      <Navbar />
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
        onSend={sendMessage}
        inProgress={inProgress}
        toggleAudio={toggleAudio}
        audioMode={audioMode}
      />
    </Flex>
  );
};

export default Chat;
