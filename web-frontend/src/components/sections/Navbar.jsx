import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  HStack,
  Link,
} from "@chakra-ui/react";
import logoWhite from '../../assets/svg/meddy-logo-white.svg';
import  SpinningLogo  from '../SpinningLogo.jsx'
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
      maxWidth="container.xl"
      mx="auto"
      my={4}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Logo and Text wrapped in Link */}
        <Link href="/" _hover={{ textDecoration: 'none' }}>
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
          <Link href="/about">About Us</Link>
          <Link href="/downloadApp">Download App</Link>
        </HStack>

        {/* Login Button */}
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
      </Flex>
    </Box>
  );
};

export default Navbar;