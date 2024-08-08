import React from "react";
import { VStack, Text, Box, Divider } from "@chakra-ui/react";
import Message from "./Message";

const MessageList = ({
  messages,
  messagesEndRef,
  inProgress,
  currentTranscription,
}) => {
  let currentDate = null;

  return (
    <VStack spacing={4} align="stretch">
      {messages.map((msg, index) => {
        const messageDate = new Date(msg.time);
        const dateString = messageDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        let dateHeader = null;
        if (dateString !== currentDate) {
          currentDate = dateString;
          dateHeader = (
            <Box
              key={`date-${index}`}
              position="relative"
              textAlign="center"
              my={6}
            >
              <Divider />
              <Text
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                px={4}
                fontSize="sm"
                color="gray.500"
              >
                {dateString}
              </Text>
            </Box>
          );
        }

        return (
          <React.Fragment key={msg.messageId}>
            {dateHeader}
            <Message
              message={msg}
              isStreaming={
                index === messages.length - 1 &&
                inProgress &&
                !currentTranscription
              }
            />
          </React.Fragment>
        );
      })}
      {currentTranscription && (
        <Message
          message={{
            source: "user",
            text: currentTranscription.text,
            time: new Date(),
            isComplete: false,
          }}
          isStreaming={true}
        />
      )}
      <div ref={messagesEndRef} />
    </VStack>
  );
};

export default MessageList;
