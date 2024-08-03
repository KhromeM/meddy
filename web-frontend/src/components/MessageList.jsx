import React from "react";
import { VStack } from "@chakra-ui/react";
import Message from "./Message";

const MessageList = ({ messages, messagesEndRef, inProgress,image }) => {
  return (
    <VStack spacing={4} align="stretch">
      {messages.map((msg, index) => (
        <Message
          key={msg.messageId}
          message={msg}
          isStreaming={index === messages.length - 1 && inProgress}
        />
      ))}
      <div ref={messagesEndRef} />
    </VStack>
  );
};

export default MessageList;
