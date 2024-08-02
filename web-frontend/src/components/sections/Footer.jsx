import React from "react";
import {
	Box,
	VStack,
	Text,
	Input,
	Button,
	Flex,
	SimpleGrid,
	Link,
	useColorModeValue,
} from "@chakra-ui/react";

export const Footer = () => {
	const bg = useColorModeValue("gray.50", "gray.800");
	const color = useColorModeValue("gray.700", "gray.200");

	return (
		<Box as="footer" bg={bg} py={12} borderTop="1px" borderColor="gray.200">
			<VStack spacing={8} maxW="container.xl" mx="auto" px={4}>
				<Box h="1px" bg="darkslategray.200" w="full" />

				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
					<VStack align="start" spacing={4}>
						<Text fontSize="2xl" fontWeight="bold" color={color}>
							Stay Updated
						</Text>
						<Text fontSize="md" color={color}>
							Subscribe to our newsletter for the latest updates on our products and services.
						</Text>
					</VStack>

					<Flex w="full" justify="end">
						<Input
							placeholder="Enter your email"
							bg="white"
							mr={2}
							borderRadius="md"
							_focus={{ borderColor: "blue.500" }}
						/>
						<Button colorScheme="blue" borderRadius="md">
							Subscribe
						</Button>
					</Flex>
				</SimpleGrid>

				<SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} w="full">
					<VStack align="start">
						<Text fontWeight="bold" color={color}>Products</Text>
						<Link href="/evi" color={color}>Empathic Voice Interface (EVI)</Link>
						<Link href="/expression-api" color={color}>Expression Measurement API</Link>
						<Link href="/custom-model-api" color={color}>Custom Model API</Link>
						<Link href="/pricing" color={color}>Pricing</Link>
					</VStack>

					<VStack align="start">
						<Text fontWeight="bold" color={color}>Research</Text>
						<Link href="/our-research" color={color}>Our Research</Link>
					</VStack>

					<VStack align="start">
						<Text fontWeight="bold" color={color}>Team</Text>
						<Link href="/about" color={color}>About</Link>
						<Link href="/contact" color={color}>Contact</Link>
					</VStack>

					<VStack align="start">
						<Text fontWeight="bold" color={color}>Other</Text>
						<Link href="/documentation" color={color}>Documentation</Link>
						<Link href="/terms" color={color}>Terms & Conditions</Link>
						<Link href="/privacy" color={color}>Privacy Policy</Link>
						<Link href="/hippa" color={color}>HIPAA</Link>
					</VStack>
				</SimpleGrid>

				<Flex justify="space-between" w="full" direction={{ base: 'column', md: 'row' }} align="center">
					<Text color={color}>© Meddy AI Inc, 2024. All rights reserved</Text>
					<Link href="/contact" color="blue.500">CONTACT US →</Link>
				</Flex>
			</VStack>
		</Box>
	);
};

export default Footer;
