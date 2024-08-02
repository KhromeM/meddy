import React, { useState } from "react";
import { VStack, Heading, Box, Image, Text, Button } from "@chakra-ui/react";
import "../../styles/RecPosts.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const Recommendations = () => {
  return (
    <VStack spacing={8} align="stretch">
      <Heading textAlign="center">Meddy Recommendations</Heading>
      <Box className="content-split">
        <Box className="side-bar">left</Box>
        <Box className="content">right</Box>
      </Box>
      <Button
        alignSelf="center"
        rightIcon={
          <Image
            src="/assets/svg-9.svg"
            boxSize="1.5rem"
            alt="Learn more icon"
          />
        }
      >
        Learn more
      </Button>
    </VStack>
  );
};

export default Recommendations;
