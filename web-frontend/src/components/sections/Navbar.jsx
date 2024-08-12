import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  HStack,
  Show,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.js";
import SpinningLogo from "../SpinningLogo.jsx";
import "../../styles/button.css";

export const Navbar = () => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg="black"
      color="white"
      py={2}
      px={4}
      borderRadius="full"
      boxShadow="md"
      width="50%"
      w={{ base: "100%", md: "100%", lg: "50%" }}
      maxWidth="container.xl"
      mx="auto"
      my={4}
      position="relative"
      zIndex={1}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Logo and Text wrapped in Link */}
        <Link href="/" _hover={{ textDecoration: "none" }}>
          <Flex alignItems="center">
            <SpinningLogo
              size={35}
              outerSpeed={10}
              innerSpeed={8}
              outerCircleSize={1.2}
              innerCircleSize={0.8}
            />
            <Text fontSize="xl" fontWeight="bold" ml={2}>
              Meddy
            </Text>
          </Flex>
        </Link>

        {/* Navigation Menu */}
        <HStack spacing={6}>
          <Link onClick={onOpen}>Download App</Link>
        </HStack>

        {/* Login Button */}
        <Show breakpoint="(min-width: 500px)">
          <Button
            className="demo-button"
            borderWidth={3}
            bgColor="#FAF9F6"
            _hover={{
              bg: "#e2fdfc",
              boxShadow: "sm",
            }}
            onClick={() => {
              history.push("/dashboard/voicemode");
            }}
          >
            Open Meddy
          </Button>
        </Show>
      </Flex>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          borderRadius="20px"
          bg="#FAF9F6"
          borderColor="#808080"
          borderWidth={2}
          p={4}
        >
          <ModalHeader fontWeight="bold">Coming Soon!</ModalHeader>
          <ModalBody>
            <Text fontSize="lg">Coming on iPhone soon!</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="outline" borderColor="#808080">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Navbar;
