import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Container, useToast, Image } from "@chakra-ui/react";
import MeddyIcon from "./MeddyIcon.jsx";
import { useAuth } from "../firebase/AuthService.jsx";
import WSConnection from "../utils/WSConnection.js";
import AudioService from "../utils/AudioService.js";
import { v4 as uuidv4 } from "uuid";
import Message from "./Message";

const AudioChat = () => {
  const [messages, setMessages] = useState([]);
  const [audioMode, setAudioMode] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const wsConnectionRef = useRef(null);
  const audioServiceRef = useRef(null);
  let _currResult = useRef(null);
  const message = {
    text: "A long text from the user asking a question or something",
    source: "user",
    isAudio: false,
    result: null,
    imageid: null,
  };
  const message2 = {
    text: `A detailed answer from the bot explaining the user's query in detail with images and text and audio and what not 
    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. `,
    source: "llm",
    isAudio: false,
    result: null,
    imageid: null,
  };

  const setupWebSocket = async () => {
    if (user && !wsConnectionRef.current) {
      console.log("CONNECTING WS");
      const wsConnection = new WSConnection();
      await wsConnection.connect();
      const idToken = await user.getIdToken(false);
      await wsConnection.authenticate(idToken);
      // console.log(idToken);
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

  const sendMessage = async (message) => {
    const text = message.text;
    const reqId = uuidv4();
    const imageid = message.imageName;
    addMessageToChatHistory("user", text, reqId + "_user", imageid);
    setInProgress(true);
    setImageUploaded(null);

    wsConnectionRef.current.send({
      type: "chat",
      data: { text: text, reqId, image: message?.imageName },
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
    <Flex direction="column"  bg="fef9ef">
        {
          <Box px={4} py={2}>
            <Flex justify="center" mb={8}>
              <Flex>
                <MeddyIcon boxSize="5rem" color="#843a06" />
              </Flex>
            </Flex>
         
              <Box h="100%"
                w={"100%"}
                margin={"0 auto"}
                bg="#000"
                borderRadius="xl"
                boxShadow="xl" 
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Box flex={1} overflowY="auto" p={6}>
                  <Text color={"#fff"} fontSize={"60px"} fontStyle="italic" textAlign="right">
                    {message.text}
                  </Text>
                  <div ref={messagesEndRef} />
                  <Box display="flex" justifyContent={"center"} >
                    <Image w={"30%"}   src="https://i.gifer.com/YdBO.gif" />
                  </Box>

                  <Text fontStyle="italic" fontSize={"60px"}  color={"#fff"} >
                    {message2.text}
                  </Text>
                  <div ref={messagesEndRef} />
                </Box>
              </Box> 
          </Box>
        }
      
    </Flex>
  );
};

export default AudioChat;
