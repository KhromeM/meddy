import React from "react";
import { Box, VStack, Text, Link, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

export const Footer = () => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("gray.700", "gray.200");

  return (
    <Box as="footer" bg={bg} py={12} borderTop="1px" borderColor="gray.200">
      <VStack spacing={8} maxW="container.xl" mx="auto" px={4}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} w="full">
          <VStack align="start">
            <Text fontWeight="bold" color={color}>Medplum</Text>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src="/assets/soc.png" alt="AICPA SOC" style={{ width: "50px", marginRight: "10px" }} />
              <img src="/assets/hipaa.png" alt="HIPAA Compliant" style={{ width: "100px" }} />
            </Box>
          </VStack>

          <VStack align="start">
            <Text fontWeight="bold" color={color}>Developers</Text>
            <Link href="/getting-started" color={color}>Getting started</Link>
            <Link href="/documentation" color={color}>Documentation</Link>
            <Link href="/search" color={color}>Search</Link>
          </VStack>

          <VStack align="start">
            <Text fontWeight="bold" color={color}>Community</Text>
            <Link href="/case-studies" color={color}>Case Studies</Link>
            <Link href="/discord" color={color}>Discord</Link>
            <Link href="/storybook" color={color}>Storybook</Link>
            <Link href="https://github.com/KhromeM/meddy" color={color}>GitHub</Link>
          </VStack>

          <VStack align="start">
            <Text fontWeight="bold" color={color}>Company</Text>
            <Link href="/about" color={color}>About us</Link>
            <Link href="/security" color={color}>Security</Link>
            <Link href="/terms-of-service" color={color}>Terms of Service</Link>
            <Link href="/privacy-policy" color={color}>Privacy Policy</Link>
            <Link href="/pricing" color={color}>Pricing</Link>
            <Link href="/enterprise" color={color}>Enterprise</Link>
            <Link href="/careers" color={color}>Careers</Link>
            <Link href="/blog" color={color}>Blog</Link>
          </VStack>
        </SimpleGrid>

        <Text color={color}>Copyright © 2024 Meddy, Inc.</Text>
      </VStack>
    </Box>
  );
};

export default Footer;
