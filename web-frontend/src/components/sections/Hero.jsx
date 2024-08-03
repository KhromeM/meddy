import React, { useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  HStack,
} from "@chakra-ui/react";
import { images } from "../../../assets/images";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";
import "../../styles/button.css";
import CardsInterface from "../CardsInterface";
import { Gradient } from "../Gradient"; // Import the Gradient class
import "../../styles/gradient.css"; // Import the gradient CSS

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
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "column", lg: "row" }}
            width="1280px"
            alignItems="center"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width={{ base: "100%", md: "100%", lg: "50%" }}
              marginTop="10%"
              paddingX="5%"
              bg="transparent"
            >
              <VStack spacing={6} align="flex-start" width="100%">
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "5xl", lg: "5xl" }}
                  fontWeight="900"
                  lineHeight="1.2"
                  letterSpacing="-0.02em"
                >
                  Medical Assistant Powered by Gemini
                </Heading>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="medium"
                  lineHeight="1.5"
                >
                  Meet the world's first voice powered medical assistant that
                  responds empathically, built to align technology with human
                  well-being
                </Text>
                <HStack
                  spacing={4}
                  alignItems={"stretch"}
                  id="1"
                  flexDirection={{ base: "column", md: "column", lg: "row" }}
                  margin={{ base: "auto", lg: "0" }}
                >
                  <Button
                    className="download-button"
                    rightIcon={
                      <Image
                        src="/assets/svg.svg"
                        boxSize="1.5rem"
                        alt="Download icon"
                        className="download-icon"
                      />
                    }
                    colorScheme="blackAlpha"
                  >
                    Download App
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = "/chat";
                    }}
                    className="download-button"
                    rightIcon={
                      <Image
                        src="/assets/svg-1.svg"
                        boxSize="1.5rem"
                        alt="Web icon"
                        className="download-icon"
                      />
                    }
                    variant="outline"
                  >
                    Try on Web
                  </Button>
                </HStack>
              </VStack>
            </Box>
            <Box
              alignContent={"end"}
              height="100%"
              width={{ base: "100%", md: "100%", lg: "50%" }}
              paddingX="5%"
              marginTop={{ base: "20px", md: "10px", lg: "5%" }}
            >
              <Image
                width="100%"
                src={images.superHero}
                alt="Code Image"
                borderRadius="md"
                maxW={{ base: "100%", md: "100%", lg: "100%" }}
              />
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
        <CardsInterface
          headingText={"Empathic Voice Interface"}
          img={images.ecnomicGraph}
          btnText={"Start Building"}
          paragraphText={
            "Start building with the world's first emotionally intelligent voice AI"
          }
          bgColor={"#f9dcb5"}
        />
        <CardsInterface
          headingText={"Measure Expression"}
          img={images.graphDark}
          btnText={"Start with Webcam"}
          paragraphText={
            "Use psychologically valid models of facial movement and vocal modulation"
          }
          bgColor={"#f0daf5"}
        />
        <CardsInterface
          headingText={"Interpret Expressive Communication"}
          img={images.graphThree}
          btnText={"Use Custom Models"}
          paragraphText={
            "Start building with the world's first emotionally intelligent voice AI"
          }
          bgColor={"#d4e1f1"}
        />
      </Box>
    </>
  );
};
