import React, { useRef, useEffect, useState } from "react";
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

export const Hero = ({ login }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.33;

      // Force play on mobile
      videoRef.current.play().catch((error) => {
        console.error("Autoplay was prevented:", error);
      });
    }
  }, []);
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  return (
    <>
      <Box
        position="relative"
        minHeight="100vh"
        width="100vw"
        overflow="hidden"
      >
        <Navbar />
        <Image
          src="/assets/dp7zbu6zhiy3wuc2ksrz-1@2x.png"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
          zIndex="-2"
        />
        <Box
          as="video"
          ref={videoRef}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
          zIndex="-1"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          src="/assets/smoothed_blurrred_bg.mp4"
          sx={{
            clipPath: "inset(2% 2% 2% 2%)",
            transform: "scale(1.0408)",
            transformOrigin: "center center",
            opacity: isVideoLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
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
            >
              <VStack spacing={6} align="flex-start" width="100%">
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "5xl", lg: "5xl" }}
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
                    as={RouterLink}
                    to="/login"
                    onClick={login}
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
