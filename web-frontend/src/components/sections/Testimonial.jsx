import React from "react";
import { Box, Text, VStack, Image, Flex } from "@chakra-ui/react";
import "../../styles/animatedBG.css";
import epicImage from "../../assets/img/epic.png";
import geminiImage from "../../assets/img/gemini.png";
import gfitImage from "../../assets/img/googlefit.png";
const Card = ({ image }) => (
      <Box 
      height="100px" 
      width="100px" 
      borderRadius="20px" 
      boxShadow="lg" 
      backgroundColor="rgba(255,255,255,0.3)" 
      alignContent="center"
      outline="2px solid rgba(10, 32, 69,0.5)"
      position="relative"
      display="flex"
      flexDirection="column"
      className="animated-box4b"
      mt="30px"
      mb="0"
      ml="15px"
      mr="15px"

      >
        <Image
          src={image}
          width="50%"
          objectFit="cover"
          margin="auto"
        />
    </Box>
  );
export const Testimonial = () => (
  <Box py={8}
    position="relative"
    display="flex"
    flexDirection="column"
    className="animated-box5">
    <Flex
      maxW="container.xl"
      mx="auto"
      direction="column"
      align="center"
    >
      <Text as="h2" size="lg" mb={0} pl={4} fontSize="34px" color="white">
          Integrate with your favorite apps
      </Text>
      <Box display="flex" flexDirection="row">
        <Card image={epicImage}></Card>
        <Card image={geminiImage}></Card>
        <Card image={gfitImage}></Card>

      </Box>
    </Flex>
  </Box>
);
