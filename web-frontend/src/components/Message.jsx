import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useAuth } from "../firebase/AuthService";

const Message = ({ message, isStreaming }) => {
  const { text, source, isAudio } = message;

  //this is sean trying to debug the empty chat box underneath the chat message displaying the audio
  if (!text && !isAudio) {
    return null;
  }

  return (
    <Box
      alignSelf={source === "user" ? "flex-end" : "flex-start"}
      bg={source === "user" ? "white" : "#fff2e4"}
      p={3}
      borderRadius="lg"
      maxW="70%"
      borderWidth={1}
      borderColor="#843a06"
    >
      {isAudio ? (
        <Text fontStyle="italic">{text}</Text>
      ) : (
        <ReactMarkdown
          components={{
            p: ({ children }) => <Text whiteSpace="pre-wrap">{children}</Text>,
            h1: ({ children }) => (
              <Text fontSize="2xl" fontWeight="bold">
                {children}
              </Text>
            ),
            h2: ({ children }) => (
              <Text fontSize="xl" fontWeight="bold">
                {children}
              </Text>
            ),
            h3: ({ children }) => (
              <Text fontSize="lg" fontWeight="bold">
                {children}
              </Text>
            ),
            ul: ({ children }) => (
              <Box as="ul" pl={4}>
                {children}
              </Box>
            ),
            ol: ({ children }) => (
              <Box as="ol" pl={4}>
                {children}
              </Box>
            ),
            li: ({ children }) => (
              <Box as="li" mb={2}>
                {children}
              </Box>
            ),
            code: ({ inline, children }) =>
              inline ? (
                <Text as="code" bg="gray.100" p={1} borderRadius="sm">
                  {children}
                </Text>
              ) : (
                <Box
                  as="pre"
                  bg="gray.100"
                  p={2}
                  borderRadius="md"
                  overflowX="auto"
                >
                  <Text as="code">{children}</Text>
                </Box>
              ),
          }}
        >
          {text}
        </ReactMarkdown>
      )}
      {isStreaming && (
        <Text as="span" animation="blink 1s infinite">
          ...
        </Text>
      )}
    </Box>
  );

};

export default Message;