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
import SpinningLogo from "../SpinningLogo.jsx";
import "../../styles/button.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.js";

export const Navbar = () => {
  const history = useHistory();

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
          <Show breakpoint="(min-width: 500px)">
            <Link href="/about">About Us</Link>
          </Show>
          <Link href="/downloadApp">Download App</Link>
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
              // transform: "scale(1.05)",
            }}
            onClick={() => {
              history.push("/dashboard/home");
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
