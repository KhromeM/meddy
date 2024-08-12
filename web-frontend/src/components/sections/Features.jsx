import React, { useState, useCallback, useRef } from "react"; 
import homeScreen from "../../assets/img/home-screenshot.png";
import languageIcon from "../../assets/img/translation.png";
import micIcon from "../../assets/svg/microphone.svg";
import clipboardIcon from "../../assets/svg/clipboard.svg";
import healthIcon from "../../assets/img/heart.png";
import spanishMedicineIdentificationGif from "../../assets/gif/spanish-medicine-identification.gif";
import spanishAudioModeFlutterGif from "../../assets/gif/spanish-audio-mode-flutter.gif";
import setReminderFlutterGif from "../../assets/gif/set-reminder-flutter.gif";
import flutterHealthPageGif from "../../assets/gif/flutter-health-page.gif";
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

const FeatureCard = ({ children, isEven, index, icon ,url,onImageChange}) =>{

	const handleImageChange = useCallback((url) => {
		if (url) { 
		  onImageChange(url);
		}
	  }, [onImageChange]);
return(
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
	  onClick={()=>handleImageChange(url)}
	  cursor={'pointer'}
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
}

export const Features = () => {
  const [image, setImage] = useState(spanishMedicineIdentificationGif);

  const updateImage = (imageUrl) => {
    setImage(imageUrl);
  };
return (
  <Flex direction={["column", "column", "row"]} align="center" justify="space-between" py={12} pl="20px" pr="35px">
    <Box flex={1} mr={[0, 0, 4]} mb={[8, 8, 0]}>
      <Image
        src={image}
        alt="Empathic Voice Interface"
        borderRadius="20px" 
        width="70%"
        objectFit="cover"
      />
    </Box>
    <Center flex={1.2} height="100%">
      <VStack align="stretch" spacing={6} width="100%">
        <Heading as="h2" size="xl" mb={0} pl={4} fontSize="48px">
          Our Features
        </Heading>
        <FeatureCard onImageChange={updateImage} isEven={false} index="1" icon={micIcon} url={spanishMedicineIdentificationGif}>Record and summarize doctor visits for later</FeatureCard>
        <FeatureCard onImageChange={updateImage} isEven={true} index="2" icon={languageIcon} url={spanishAudioModeFlutterGif}>Translate your doctor</FeatureCard>
        <FeatureCard onImageChange={updateImage} isEven={false} index="3" icon={clipboardIcon} url={setReminderFlutterGif}>Set up appointments with one click</FeatureCard>
        <FeatureCard onImageChange={updateImage} isEven={true} index="4" icon={healthIcon} url={flutterHealthPageGif}>Get a simple overview of your health data</FeatureCard>
      </VStack>
    </Center>
  </Flex>
);
}