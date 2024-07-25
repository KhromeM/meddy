import React from "react";
import { Box, Text, VStack, Image, Flex } from "@chakra-ui/react";

export const Testimonial = () => (
	<Box bg="darkslategray.100" color="white" py={16}>
		<Flex
			maxW="container.xl"
			mx="auto"
			direction={{ base: "column", md: "row" }}
			align="center"
		>
			<VStack spacing={4} maxW="xl" textAlign="left" flex={1} p={4}>
				<Text fontSize="xl" fontStyle="italic">
					"I wanted to access my own medical data without jumping through a
					dozen hoops"
				</Text>
				<Text fontWeight="bold">John Williams, Blind mf</Text>
				<Image
					src="/assets/svg-10.svg"
					boxSize="100px"
					alignSelf="flex-start"
					alt="Decorative SVG"
				/>
			</VStack>
			<Box flex={1} p={4}>
				<Image
					src="/assets/l1000779-webjpgjpg@2x.png"
					alt="Testimonial"
					objectFit="cover"
				/>
			</Box>
		</Flex>
	</Box>
);
