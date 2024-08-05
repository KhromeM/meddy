
import React, { useState } from 'react';
import { LuRocket } from "react-icons/lu";
import { Box, VStack, Text, Button } from '@chakra-ui/react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <Box
        position="fixed"
        bottom="0"
        right="0"
        margin="4"
        width="400px"
        height="300px"
        boxShadow="md"
        bg="teal.500"
        color="white"
        borderRadius="md"
        zIndex="9999"
        display={isOpen ? "block" : "none"}
        padding="4"
      >
        <Box
          position="absolute"
          top="4"
          right="4"
          color="white"
          fontSize="2xl"
        >
          <LuRocket />
        </Box>
        <VStack spacing="4" height="100%" justifyContent="center">
          <Text fontWeight="bold" fontSize="lg">
            Meet EVI, our empathic AI voice
          </Text>
          <Button
            bg={'#000'}
            color={"#fff"}
            onClick={() => {
              alert("Starting conversation...");
            }}
          >
            Start Conversation
          </Button>
        </VStack>
      </Box>

      <Box
        position="fixed"
        bottom="0"
        right="0"
        margin="4"
        padding="6px"
        cursor="pointer"
        zIndex="9999"
        onClick={onOpen}
      >
        {!isOpen ? (
          <img
            src="https://cdn-icons-png.flaticon.com/512/6014/6014401.png"
            alt="Chat Icon"
            style={{ width: '50px', height: '50px' }}
          />
        ) : (
          <img
            src="https://simplymemoirs.s3.us-west-1.amazonaws.com/images/delete.png-16"
            alt="Close Icon"
            style={{ width: '50px', height: '50px', backgroundBlendMode: 'color-burn', objectFit: 'contain' }}
          />
        )}
      </Box>
    </>
  );
};

export default ChatWidget;
