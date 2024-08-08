import React, { useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { images } from "../../../assets/images";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";
import "../../styles/button.css";
import CardsInterface from "../CardsInterface";
import { Gradient } from "../Gradient"; // Import the Gradient class
import "../../styles/gradient.css"; // Import the gradient CSS
import MeddyDemoGif from "../../assets/gif/MeddyDemo.gif"; 
import "../../styles/animatedBG.css"


export const Hero = ({ login }) => {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 400;
      const opacity = Math.max(1 - scrollPosition / maxScroll, 0);

      const canvas = document.querySelector("#gradient-canvas");
      if (canvas) {
        canvas.style.opacity = opacity;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Box
        position="relative"
        minHeight="100vh"
        width="100vw"
        overflow="hidden"
        bg="transparent"
      >
        <canvas
          id="gradient-canvas"
          data-js-darken-top
          data-transition-in
        ></canvas>
        <Navbar />
        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            width="1280px"
            alignItems="center"
            textAlign="center"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width={{ base: "100%", md: "100%", lg: "80%" }}
              marginTop="10%"
              paddingX="5%"
              bg="transparent"
            >
              <VStack spacing={6} align="center" width="100%">
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "5xl", lg: "5xl" }}
                  fontWeight="900"
                  lineHeight="1.2"
                  letterSpacing="-0.02em"
                >
                  Meet your AI health companion
                </Heading>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="medium"
                  lineHeight="1.5"
                >
                  The world's first voice powered medical assistant that
                  responds empathically, built to align technology with human
                  well-being
                </Text>
                <Button
                  onClick={() => {
                    window.location.href = "/dashboard/chat";
                  }}
                  className="custom-button"
                  rightIcon={
                    <Image
                      src="/assets/svg-1.svg"
                      boxSize="2rem"
                      alt="Web icon"
                      className="download-icon"
                    />
                  }
                  variant="outline"
                  size="lg"
                  height="55px"
                  width="250px"
                  px="8"
                  fontSize="xl"
                >
                  Try on Web
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        maxW={{ base: "90%", md: "70%", lg: "100%" }}
        style={{
          maxWidth: "1280px",
          margin: "auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            position="relative"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            borderRadius="md"
            className="animated-box" 
          >
            <Image
              src={MeddyDemoGif}
              alt="Empathic Voice Interface GIF"
              boxSize="100%"
              maxW="800px"
              borderRadius="md"
              zIndex={1}
            />
          </Box>
          <Box
            bg="#f9dcb5"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <VStack align="flex-start" spacing={4}>
              <Heading as="h3" size="lg">
                Empathic Voice Interface (EVI)
              </Heading>
              <Text>
                Give your application empathy and a voice. EVI is a
                conversational voice API powered by empathic AI. It is the only
                API that measures nuanced vocal modulations, guiding language
                and speech generation. Trained on millions of human
                interactions, our empathic large language model (eLLM) unites
                language modeling and text-to-speech with better EQ, prosody,
                end-of-turn detection, interruptibility, and alignment.
              </Text>
              <HStack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/learn-more"
                  variant="solid"
                  colorScheme="blackAlpha"
                >
                  Learn More
                </Button>
                <Button
                  as={RouterLink}
                  to="/playground"
                  variant="outline"
                  colorScheme="blackAlpha"
                >
                  Playground
                </Button>
              </HStack>
            </VStack>
          </Box>
          <CardsInterface
            headingText={"Measure Expression"}
            img={images.ecnomicGraph}
            btnText={"Start with Webcam"}
            paragraphText={
              "Use psychologically valid models of facial movement and vocal modulation."
            }
            bgColor={"#f0daf5"}
          />
          <CardsInterface
            headingText={"Interpret Expressive Communication"}
            img={images.graphThree}
            btnText={"Use Custom Models"}
            paragraphText={
              "Start building with the world's first emotionally intelligent voice AI."
            }
            bgColor={"#d4e1f1"}
          />
        </SimpleGrid>
      </Box>
    </>
  );
};
