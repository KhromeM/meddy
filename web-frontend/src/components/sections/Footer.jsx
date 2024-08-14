import React from "react";
import { Box, Flex, Text, Link, useColorModeValue } from "@chakra-ui/react";

export const Footer = () => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("gray.700", "gray.200");

  return (
    <Box as="footer" bg={bg} py={12} borderTop="1px" borderColor="gray.200">
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        justifyContent="center"
        alignItems="center"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
      >
        <Link href="https://github.com/KhromeM/meddy" color={color}>
          GitHub
        </Link>
        <Text color={color}>Copyright © 2024 Meddy, Inc.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
