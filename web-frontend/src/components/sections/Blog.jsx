import React from "react";
import {
	VStack,
	Heading,
	SimpleGrid,
	Box,
	Image,
	Text,
	Button,
} from "@chakra-ui/react";

const BlogPost = ({ title, date, image }) => (
	<Box borderWidth={1} borderRadius="lg" overflow="hidden">
		<Image src={image} alt={title} />
		<Box p={4}>
			<Heading size="md" mb={2}>
				{title}
			</Heading>
			<Text fontSize="sm" color="gray.500" mb={4}>
				{date}
			</Text>
		</Box>
	</Box>
);

export const Blog = () => (
	<VStack spacing={8} align="stretch">
		<Heading textAlign="center">Latest Updates</Heading>
		<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
			<BlogPost
				title="Who is Meddy?"
				date="Apr 18, 2024"
				image="/assets/gfd1mhkys4v2qt6dyfzb-1@2x.png"
			/>
			<BlogPost
				title="Meddy-human symbiosis"
				date="Feb 9, 2024"
				image="/assets/mnkbvkebhngvvgeb2r74-1@2x.png"
			/>
			<BlogPost
				title="Take the Meddy path through life"
				date="Feb 21, 2024"
				image="/assets/tucagxrxrfpn2ojse68i-2@2x.png"
			/>
		</SimpleGrid>
		<Button
			alignSelf="center"
			rightIcon={
				<Image src="/assets/svg-9.svg" boxSize="1.5rem" alt="Learn more icon" />
			}
		>
			Learn more about our research
		</Button>
	</VStack>
);
