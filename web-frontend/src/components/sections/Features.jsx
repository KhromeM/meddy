import React from "react";
import homeScreen from "../../assets/img/home-screenshot.png";
import languageIcon from "../../assets/img/translation.png";
import micIcon from "../../assets/svg/microphone.svg";
import clipboardIcon from "../../assets/svg/clipboard.svg";
import healthIcon from "../../assets/img/heart.png";

import "../../styles/animatedBG.css";

import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Image,
  Center,
} from "@chakra-ui/react";

const FeatureCard = ({ children, isEven, index, icon }) => (
	<Box 
	  position="relative"
	  boxShadow="lg"
	  display="flex"
	  flexDirection="row"
	  justifyContent="space-between"
	  alignItems="center"
	  borderRadius="20px"
	  className={`animated-box${index}`}
	  p={6}
	  minHeight="100px"
	  width="90%"
	  alignSelf={isEven ? "flex-end" : "flex-start"}
	  mb={2}
	  outline="2px solid rgba(10, 32, 69,0.3)"
	  transition="transform 0.2s ease-in-out"  // Add smooth transition
	  _hover={{
		transform: "scale(1.02)",
	  }}
	>
	  <Text 
		fontSize="22px" 
		fontWeight="300"
		position="relative"
		zIndex={1}
		color="black"
		textAlign="left"
		flex="1"
	  >
		{children}
	  </Text>
	  <Image
		src={icon}
		alt="Feature Icon"
		boxSize="40px"
		ml={4}
		zIndex={1}
	  />
	</Box>
  );

export const Features = () => (
  <Flex direction={["column", "column", "row"]} align="center" justify="space-between" py={12} pl="20px" pr="35px">
    <Box flex={1} mr={[0, 0, 4]} mb={[8, 8, 0]}>
      <Image
        src={homeScreen}
        alt="Empathic Voice Interface"
        borderRadius="20px"
        boxShadow="lg"
        width="70%"
        objectFit="cover"
      />
    </Box>
    <Center flex={1.2} height="100%">
      <VStack align="stretch" spacing={6} width="100%">
        <Heading as="h2" size="xl" mb={0} pl={4} fontSize="48px">
          Our Features
        </Heading>
        <FeatureCard isEven={false} index="1" icon={micIcon}>Record and summarize doctor visits for later</FeatureCard>
        <FeatureCard isEven={true} index="2" icon={languageIcon}>Translate your doctor</FeatureCard>
        <FeatureCard isEven={false} index="3" icon={clipboardIcon}>Set up appointments with one click</FeatureCard>
        <FeatureCard isEven={true} index="4" icon={healthIcon}>Get a simple overview of your health data</FeatureCard>
      </VStack>
    </Center>
  </Flex>
);