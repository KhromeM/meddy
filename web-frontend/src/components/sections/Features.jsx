import React from "react";
import {
	VStack,
	Heading,
	Text,
	SimpleGrid,
	Box,
	Image,
} from "@chakra-ui/react";

const FeatureCard = ({ title, description, icon }) => (
	<Box borderWidth={1} borderRadius="lg" p={6}>
		<Image src={icon} alt={title} boxSize="50px" mb={4} />
		<Heading size="md" mb={4}>
			{title}
		</Heading>
		<Text>{description}</Text>
	</Box>
);

export const Features = () => (
	<VStack spacing={8} align="stretch">
		<Heading textAlign="center">Our Features</Heading>
		<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
			<FeatureCard
				title="Voice Interface"
				description="Interact naturally with our AI-powered voice interface."
				icon="/assets/svg-2.svg"
			/>
			<FeatureCard
				title="Expression Measurement"
				description="Analyze vocal and facial expressions for better understanding."
				icon="/assets/svg-5.svg"
			/>
			<FeatureCard
				title="Custom Model"
				description="Tailor our AI to your specific needs and use cases."
				icon="/assets/svg-7.svg"
			/>
		</SimpleGrid>
	</VStack>
);
