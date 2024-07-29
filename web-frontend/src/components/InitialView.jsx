import React from "react";
import {
	VStack,
	Heading,
	SimpleGrid,
	Box,
	Text,
	Icon,
	useBreakpointValue,
} from "@chakra-ui/react";
import {
	FaComment,
	FaStar,
	FaShieldAlt,
	FaRegSun,
	FaRegLaughBeam,
	FaRegGrimace,
	FaFileMedical,
} from "react-icons/fa";

const FeatureBox = ({ icon, title, description }) => {
	const boxWidth = useBreakpointValue({
		base: "100%",
		xl: "25rem",
	});

	return (
		<Box
			borderWidth={1}
			borderRadius="lg"
			p={4}
			width={boxWidth}
			mb={4}
			borderColor={"#843a06"}
		>
			<Icon as={icon} boxSize={6} mb={2} />

			<Text fontWeight="bold" mb={2}>
				{title}
			</Text>
			<Text fontSize="sm">{description}</Text>
		</Box>
	);
};

const InitialView = () => (
	<VStack spacing={8} align="stretch" mt={8}>
		<SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
			<VStack align="start" spacing={4}>
				<Heading size="md">Examples</Heading>

				<FeatureBox
					icon={FaFileMedical}
					title="Using your medical records."
					description="Syncs with epic, giving you easy access to your data"
				/>
				<FeatureBox
					icon={FaRegLaughBeam}
					title="Mental Health"
					description="What are the benefits of sunlight for mental health?"
				/>
				<FeatureBox
					icon={FaRegGrimace}
					title="Long Chats"
					description='"How often should I go to the dentist?"'
				/>
			</VStack>
			<VStack align="start" spacing={4}>
				<Heading size="md">Capabilities</Heading>
				<FeatureBox
					icon={FaComment}
					title="Multiple Languages"
					description="Supports text and audio prompts in multiple languages"
				/>
				<FeatureBox
					icon={FaStar}
					title="Sync with Epic"
					description="Syncs with epic, giving you easy access to your data"
				/>
				<FeatureBox
					icon={FaComment}
					title="Long Chats"
					description="High context window, allowing long chats"
				/>
			</VStack>
			<VStack align="start" spacing={4}>
				<Heading size="md">Limitations</Heading>
				<FeatureBox
					icon={FaShieldAlt}
					title="Information Accuracy"
					description="May occasionally generate incorrect information."
				/>
				<FeatureBox
					icon={FaShieldAlt}
					title="Content Safety"
					description="May occasionally produce harmful instructions or biased content."
				/>
				<FeatureBox
					icon={FaShieldAlt}
					title="Knowledge Cutoff"
					description="Limited knowledge of world andevents after 2021."
				/>
			</VStack>
		</SimpleGrid>
	</VStack>
);

export default InitialView;
