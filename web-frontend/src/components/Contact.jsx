import React from "react";
import { Box, Container, VStack, Heading, Text, Input, Textarea, Button } from "@chakra-ui/react";
import { Hero } from "./sections/Hero"; // Assuming you want to keep the Hero section
import { Footer } from "./sections/Footer"; // Assuming the Footer is the same

export const Contact = () => {
	return (
		<Box w="full" overflowX="hidden">
			<VStack
				spacing={{ base: "4rem", md: "6rem", lg: "8rem" }}
				align="stretch"
			>

				<Container maxW="container.xl" px={4}>
					<VStack spacing="2rem" align="stretch">
						<Heading as="h2" size="xl" textAlign="center">
							Contact Us
						</Heading>

						<Box>
							<Heading as="h3" size="lg" mb="1rem">
								Get in Touch
							</Heading>
							<VStack spacing="1rem" align="stretch">
								<Input placeholder="Your Name" size="lg" />
								<Input placeholder="Your Email" size="lg" />
								<Textarea placeholder="Your Message" size="lg" />
								<Button colorScheme="blue" size="lg">Send Message</Button>
							</VStack>
						</Box>

						<Box>
							<Heading as="h3" size="lg" mb="1rem">
								Our Location
							</Heading>
							<Text>
								1234 Street Name, City, State, 12345
							</Text>
							<Box mt="2rem">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.4974575904167!2d-122.4194154846817!3d37.77492927975954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858157426ad633%3A0xa3b6d77c84063544!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1616174504537!5m2!1sen!2sus"
									width="100%"
									height="450"
									style={{ border: 0 }}
									allowFullScreen=""
									loading="lazy"
								></iframe>
							</Box>
						</Box>

						<Box>
							<Heading as="h3" size="lg" mb="1rem">
								Additional Contact Information
							</Heading>
							<Text>
								Email: contact@example.com
							</Text>
							<Text>
								Phone: (123) 456-7890
							</Text>
						</Box>
					</VStack>
				</Container>

				<Footer />
			</VStack>
		</Box>
	);
};
