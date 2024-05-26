import React from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const Message = ({ message }) => {
  const { text, image, isUser } = message;

  return (
    <Box
      className={`message ${isUser ? 'user' : 'bot'}`}
      bg={isUser ? 'blue.100' : 'gray.100'}
      p={3}
      borderRadius="md"
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="70%"
      my={2}
      boxShadow="md"
    >
      {text && <Text>{text}</Text>}
      {image && <Image src={image} alt="chat" mt={2} borderRadius="md" />}
    </Box>
  );
};

export default Message;
