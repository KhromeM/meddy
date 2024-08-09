import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Image, VStack } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useAuth } from "../firebase/AuthService";
import { getImage } from "../server/imageHandler";

const Message = ({ message, isStreaming }) => {
  const { text, source, isAudio, result, time } = message;
  const isUser = source === "user";
  const { user } = useAuth();
  let userName = user?.displayName || "You";
  userName = userName.split(" ")[0];
  const [image, setImage] = useState(null);

  const fetchImage = async () => {
    const response = await getImage({ name: message.imageid}, user);
    if (response.status == 200) {
      setImage(response.data);
    }
  };
  useEffect(() => {
    if (isUser && message.imageid) {
      fetchImage();
    }
  }, [message.imageid, isUser]);

  if (!text && !isAudio) {
    return null;
  }

  const getBackgroundColor = () => {
    if (!result) return isUser ? "white" : "#fff2e4";
    return result.success ? "green.50" : "red.50";
  };

  const getIcon = () => {
    if (!result) return null;
    return result.success ? (
      <CheckCircleIcon color="green.500" />
    ) : (
      <WarningIcon color="red.500" />
    );
  };

  const formattedTime = new Date(time).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <VStack
      alignItems={isUser ? "flex-end" : "flex-start"}
      spacing={1}
      width="100%"
    >
      <Box
        bg={getBackgroundColor()}
        p={3}
        borderRadius="lg"
        maxW="70%"
        borderWidth={1}
        borderColor={
          result ? (result.success ? "green.200" : "red.200") : "#843a06"
        }
      >
        <Flex alignItems="center" mb={2}>
          {getIcon()}
          <Text
            ml={0}
            fontWeight="bold"
            alignSelf={isUser ? "flex-end" : "flex-start"}
          >
            {isUser ? userName : "Meddy"}
          </Text>
        </Flex>
        {isAudio ? (
          <Text fontStyle="italic">{text}</Text>
        ) : (
          <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
        )}

        {isStreaming && (
          <Text as="span" animation="blink 1s infinite">
            ...
          </Text>
        )}
        {isUser && image ? (
          <Box h={"100%"} maxHeight={"400px"} maxWidth={"400px"} mt={4}>
            <Image w={"100%"} h={"100%"} src={image} alt="Image" />
          </Box>
        ) : null}
      </Box>
      <Text
        fontSize="xs"
        color="gray.500"
        alignSelf={isUser ? "flex-end" : "flex-start"}
        mx={5}
      >
        {formattedTime}
      </Text>
    </VStack>
  );
};

export default Message;

const markdownComponents = {
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
      <Box as="pre" bg="gray.100" p={2} borderRadius="md" overflowX="auto">
        <Text as="code">{children}</Text>
      </Box>
    ),
};
