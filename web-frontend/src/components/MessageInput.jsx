import React, { useState, useCallback, useRef } from "react";
import {
  Flex,
  Input,
  IconButton,
  useToast,
  Box,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { GoPaperclip, GoX } from "react-icons/go";
import { useLockBodyScroll } from "@uidotdev/usehooks";

const MessageInput = ({
  onSend,
  inProgress,
  toggleAudio,
  audioMode,
  onUpload,
  imageUploaded,
  handleDeleteImage,
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
  const handleRemoveImage = useCallback(() => {
    setimageName("");
    handleDeleteImage();
  }, [handleDeleteImage]);
  const [isLocked, setIsLocked] = useState(true);
  isLocked && useLockBodyScroll();

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <Flex
      margin={0}
      mb="1px"
      mt={4}
      px={16}
      minW={{ base: "80%", md: "60%", lg: "800px" }}
      maxW={{ base: "100%", md: "80%", lg: "1280px" }}
      mx={"auto"}
      align={"center"}
    >
      <Flex
        flex={1}
        borderWidth={1}
        borderColor="#0e3c26"
        borderRadius={imageUploaded ? "2xl" : "full"}
        flexDirection={"column"}
        bg="white"
        align="start"
        width={"100%"}
        px={4}
        mr={2}
      >
        {imageUploaded && (
          <Box
            mt={2}
            p={2}
            color="white"
            borderRadius="md"
            display="flex"
            alignItems="center"
            fontSize="sm"
            position={"relative"}
            w={{ base: "100px", md: "100px" }}
          >
            <IconButton
              _hover={{ background: "rgba(0, 0, 0, 0.5)" }}
              bg="rgba(0, 0, 0, 0.2)"
              icon={<GoX />}
              onClick={handleRemoveImage}
              aria-label="remove image"
              size="xs"
              position="absolute"
              top={1}
              right={-6}
            />
            <Image
              maxHeight={"100px"}
              objectFit={"contain"}
              w={"100%"}
              h={"100%"}
              src={imageUploaded}
              alt="Image"
            />
            <Text isTruncated>{imageName}</Text>
          </Box>
        )}
        <Flex flex={1} align="center" width={"100%"} borderWidth={0}>
          <IconButton
            _hover={{ background: "transparent" }}
            bg={"transparent"}
            icon={<GoPaperclip />}
            onClick={handleClipClick}
            aria-label="upload file"
            size="xl"
            color="#0e3c26"
          />
          <Input
            accept={"image/*"}
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
            color="#0e3c26"
          />
        </Flex>
      </Flex>
      <IconButton
        icon={
          audioMode ? (
            <FaRegStopCircle b="#0e3c26" color="white" />
          ) : (
            <FaMicrophone bg="#0e3c26" color="white" />
          )
        }
        bg="#0e3c26"
        aria-label="Voice input"
        borderRadius="full"
        size="lg"
        onClick={toggleAudio}
      />
    </Flex>
  );
};

export default MessageInput;
