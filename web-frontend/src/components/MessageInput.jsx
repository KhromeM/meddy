import React, { useState, useCallback, useRef } from "react";
import { Flex, Input, IconButton, useToast, Box,Text } from "@chakra-ui/react";
import { FaMicrophone, FaAngleRight, FaRegStopCircle } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { GoPaperclip,GoFile } from "react-icons/go";

const MessageInput = ({
  onSend,
  inProgress,
  toggleAudio,
  audioMode,
  onUpload,
  imageUploaded,
}) => {
  const [text, setText] = useState("");
  const [imageName, setimageName] = useState("");
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleSend = useCallback(() => {
    if (text.trim() && !inProgress) {
      onSend({ text: text.trim(), imageName });
      setText("");
      setimageName("");
    }
  }, [text, inProgress, onSend]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleUpload = useCallback(() => {
    if (fileInputRef.current.files.length) {
      const file = fileInputRef.current.files[0];
      onUpload(file);
      fileInputRef.current.value = null;
    }
  }, [onUpload]);

  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        console.log("Image selected:", file);
        setimageName(file.name);
        handleUpload();
      } else {
        console.error("Only image files are allowed.");
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    },
    [handleUpload]
  );
  const handleClipClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Flex
      margin={10}
      p={2}
      minW={{ base: "80%", md: "60%", lg: "800px" }}
      maxW={{ base: "100%", md: "80%", lg: "1280px" }}
      mx={"auto"}
    >
      <Flex
        flex={1}
        borderWidth={1}
        borderColor="#843A05"
        borderRadius="full"
        bg="white"
        align="center"
        width={"100%"}
        px={4}
        mr={2}
        position="relative"
      >
        <IconButton
          _hover={{ background: "transparent" }}
          bg={"transparent"}
          icon={<GoPaperclip />}
          onClick={handleClipClick}
          aria-label="upload file"
          size="xl"
        />{" "}
        {imageUploaded && (
          <Box
            position="absolute"
            top="-12"
            left="0"
            mt={2}
            p={2}
            bg="gray.700"
            color="white"
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            fontSize="sm"
            w={{base:'100%',md:'fit-content'}}
          >
            <GoFile style={{ marginRight: "8px" }} />
            <Text isTruncated>{imageName}</Text>
          </Box>
        )}
        <Input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type message..."
          border="none"
          _focus={{ boxShadow: "none" }}
        />
        <IconButton
          _hover={{ background: "transparent" }}
          bg={"transparent"}
          icon={<VscSend />}
          onClick={handleSend}
          isDisabled={inProgress || !text.trim()}
          aria-label="Send message"
          size="lg"
        />
      </Flex>
      <IconButton
        icon={audioMode ? <FaRegStopCircle /> : <FaMicrophone />}
        colorScheme="orange"
        aria-label="Voice input"
        borderRadius="full"
        size="lg"
        onClick={toggleAudio}
      />
    </Flex>
  );
};

export default MessageInput;
