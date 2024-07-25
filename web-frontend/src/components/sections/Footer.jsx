import React from "react";
import {
	Box,
	VStack,
	Text,
	Input,
	Button,
	Flex,
	SimpleGrid,
} from "@chakra-ui/react";

export const Footer = () => (
	<Box as="footer" bg="gray.100" py={8}>
		<VStack spacing={8} maxW="container.xl" mx="auto" px={4}>
			<Box h="1px" bg="darkslategray.100" w="full" />

			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
				<VStack align="start" spacing={4}>
					<Text fontSize="2xl" fontWeight="light">
						Sign up for our newsletter
					</Text>
					<Text>
						Sign up for our newsletter to hear our latest product releases.
					</Text>
				</VStack>

				<Flex>
					<Input placeholder="Enter email for updates" bg="white" mr={2} />
					<Button colorScheme="blackAlpha">→</Button>
				</Flex>
			</SimpleGrid>

			<SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} w="full">
				<VStack align="start">
					<Text fontWeight="bold">Products</Text>
					<Text>Overview</Text>
					<Text>Empathic Voice Interface (EVI)</Text>
					<Text>Expression Measurement API</Text>
					<Text>Custom Model API</Text>
					<Text>Pricing</Text>
				</VStack>

				<VStack align="start">
					<Text fontWeight="bold">Research</Text>
					<Text>Our Research</Text>
				</VStack>

				<VStack align="start">
					<Text fontWeight="bold">Team</Text>
					<Text>About</Text>
					<Text>Contact</Text>
				</VStack>

				<VStack align="start">
					<Text fontWeight="bold">Other</Text>
					<Text>Documentation</Text>
					<Text>Terms & Conditions</Text>
					<Text>Privacy Policy</Text>
					<Text>HIPPA</Text>
				</VStack>
			</SimpleGrid>

			<Flex justify="space-between" w="full">
				<Text>© Meddy AI Inc, 2024. All rights reserved</Text>
				<Text>CONTACT US →</Text>
			</Flex>
		</VStack>
	</Box>
);
