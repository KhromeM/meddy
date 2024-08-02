import React, { useState } from "react";
import {
  VStack,
  Heading,
  Box,
  Text,
  Button,
  Image, // Import Image from Chakra UI
} from "@chakra-ui/react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./Endorsements.css"; // Import your CSS file

const Endorsement = ({ text, name }) => (
  <Box borderWidth={1} borderRadius="lg" overflow="hidden" p={4} height="100%">
    <Text fontSize="md" mb={4}>
      "{text}"
    </Text>
    <Text fontSize="sm" color="gray.500">
      - {name}
    </Text>
  </Box>
);

export const Endorsements = () => {
  const [state, setState] = useState({
    options: {
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 2100,
      smartSpeed: 600,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 3,
        },
      },
    },
  });

  return (
    <VStack spacing={8} align="stretch">
      <Heading textAlign="center">What Doctors Have Say:</Heading>
      <Box className="scrolling-container">
        <OwlCarousel {...state.options} className="owl-theme">
          <Endorsement
            text="This app will revolutionize the way we help our patients. It's a game-changer!"
            name="Joe Doe "
          />
          <Endorsement
            text="Incredible experience, highly recommend."
            name="Jane Smith"
          />
          <Endorsement
            text="Absolutely fantastic, will use again!"
            name="Michael Johnson"
          />
        </OwlCarousel>
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
        Learn more about our success stories
      </Button>
    </VStack>
  );
};
