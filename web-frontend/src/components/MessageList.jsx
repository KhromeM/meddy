import React from "react";
import { VStack } from "@chakra-ui/react";
import Message from "./Message";

const MessageList = ({ messages, messagesEndRef, inProgress }) => {
  return (
    <VStack spacing={4} align="stretch">
      {messages.map((msg, index) => (
        <Message
          key={msg.messageid}
          message={msg}
          isStreaming={index === messages.length - 1 && inProgress}
        />
      ))}
      <div ref={messagesEndRef} />
    </VStack>
  );
};

export default MessageList;
