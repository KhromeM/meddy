import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  HStack,
  Link,
  Show,
} from "@chakra-ui/react";
import logoWhite from "../../assets/svg/meddy-logo-white.svg";

export const Navbar = () => {
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
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Logo and Text wrapped in Link */}
        <Link href="/" _hover={{ textDecoration: "none" }}>
          <Flex alignItems="center">
            <Image src={logoWhite} alt="Meddy Logo" h="28px" />
            <Text fontSize="xl" fontWeight="bold" ml={2}>
              Meddy
            </Text>
          </Flex>
        </Link>

        {/* Navigation Menu */}
        <HStack spacing={6}>
          <Show breakpoint="(min-width: 500px)">
            <Link href="/about">About Us</Link>
          </Show>
          <Link href="/downloadApp">Download App</Link>
        </HStack>

        {/* Login Button */}
        <Show breakpoint="(min-width: 500px)">
          <Button
            bg="white"
            color="black"
            borderRadius="full"
            px={6}
            _hover={{ bg: "gray.200" }}
            fontWeight={400}
            onClick={() => {
              window.location.href = "dashboard/chat";
            }}
          >
            Try Demo
          </Button>
        </Show>
      </Flex>
    </Box>
  );
};

export default Navbar;
