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
  Flex,
} from "@chakra-ui/react";
import { images } from "../../../assets/images";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";
import "../../styles/button.css";
import CardsInterface from "../CardsInterface";
import { Gradient } from "../Gradient"; // Import the Gradient class
import "../../styles/gradient.css"; // Import the gradient CSS
import MeddyDemoGif from "../../assets/gif/Meddy.gif";
import "../../styles/animatedBG.css";
import Card from "../Card/Card";
import GeminiLogo from "../../assets/img/google-gemini-icon.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import AnimatedDisplay from "./animatedDisplay";
import FlutterVideo from "../../assets/video/fluttervideo.mp4"
import BarGraph from './graphAnimation/BarGraph.jsx';

export const Hero = ({ login }) => {
  const history = useHistory();

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 1000;
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
      <Box position="relative" width="100vw" overflow="hidden" bg="transparent">
        <canvas
          id="gradient-canvas"
          data-js-darken-top
          data-transition-in
        ></canvas>
        <Box mx={2}>
          <Navbar />
        </Box>
        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "column", lg: "column" }}
            width="1280px"
            w={{ "2xl": "80%" }}
            alignItems="center"
            textAlign="center"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width={{ base: "100%", md: "100%", lg: "100%" }}
              marginTop="9%"
              paddingX="5%"
              bg="transparent"
            >
              <VStack spacing={4} align="center" width="100%">
                <Card
                  margin="-7px"
                  minHeight="20px"
                  maxWidth="150px"
                  padding="6px 5px"
                  _hover={{
                    cursor: "pointer",
                  }}
                  target="_blank"
                  onClick={() => {
                    window.open("https://ai.google.dev/competition", "_blank");
                  }}
                >
                  <Text
                    fontSize="11px"
                    fontWeight={600}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    Powered by{" "}
                    <Image boxSize="20px" src={GeminiLogo} margin="2px" />{" "}
                    Gemini
                  </Text>
                </Card>
                <Heading
                  as="h1"
                  fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}
                  fontWeight="900"
                  lineHeight="1.2"
                  letterSpacing="-0.02em"
                  w={"100%"}
                  textAlign={"center"}
                >
                  Meddy, your AI health companion
                </Heading>
                <Text
                  fontSize={{ base: "16px", md: "22px" }}
                  fontWeight="500"
                  lineHeight="1.5"
                  color="gray.600"
                  w={"60%"}
                  textAlign={{ base: "center", md: "center", lg: "center" }}
                >
                  The world's first voice powered medical assistant that
                  responds empathically, built to align technology with human
                  well-being
                </Text>
                <HStack
                  spacing={4}
                  alignItems={"stretch"}
                  id="1"
                  w={"100%"}
                  margin={{ base: "auto", lg: "0" }}
                  justifyContent={{
                    base: "center",
                    md: "center",
                    lg: "center",
                  }}
                >
                  <Button
                    mt={4}
                    onClick={() => {
                      history.push("/dashboard/voicemode");
                    }}
                    className="custom-button"
                    fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                    variant="outline"
                    w={"fit-content"}
                    height="60px"
                    width="240px"
                    borderWidth={3}
                    bgColor="#FAF9F6"
                    _hover={{
                      bg: "#e2fdfc",
                      boxShadow: "sm",
                      // transform: "scale(1.05)",
                    }}
                  >
                    Try Voice Mode
                  </Button>
                </HStack>
              </VStack>
            </Box>
            <Box
              mt={{ base: "60px", md: "80px", lg: "100px" }}
              mb={{ base: "60px", md: "80px", lg: "100px" }}
              pb={{ base: "40px", md: "60px", lg: "80px" }}
              px={{ base: "80px", md: "100px", lg: "130px" }}
              width="100%"
              height={{ base: "400px", md: "500px", lg: "650px" }}
              position="relative"
              overflow="visible"
            >
              <AnimatedDisplay
                imageSrc={images.heroImage}
                phoneVideoSrc={FlutterVideo}

              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        style={{
          margin: "auto",
          boxSizing: "border-box",
        }}
        width="1280px"
        w={{ xl: "80%" }}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} paddingX="5%">
          <Box
            position="relative"
            boxShadow="lg"
            display="flex"
            flexDirection="column"
            borderRadius="md"
            className="animated-box1"
          >
            <Image
              src={MeddyDemoGif}
              alt="Empathic Voice Interface GIF"
              boxSize="100%"
              maxW="100%"
              borderRadius="md"
              zIndex={1}
            />
          </Box>
          <Box
            className="animated-box2"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <VStack align="flex-start" spacing={4} p={10}>
              <Heading as="h3" size="lg">
                Empathic Voice Interface (EVI)
              </Heading>
              <Text style={{ lineHeight: "1.8em" }}>
                Give your application empathy and a voice. EVI is a
                conversational voice API powered by empathic AI. It is the only
                API that measures nuanced vocal modulations, guiding language
                and speech generation. Trained on millions of human
                interactions, our empathic large language model (eLLM) unites
                language modeling and text-to-speech with better EQ, prosody,
                end-of-turn detection, interruptibility, and alignment.
              </Text>
              <Flex flexWrap={"wrap"} gap={4}>
                <Button
                  as={RouterLink}
                  to="/learn-more"
                  variant="solid"
                  colorScheme="blackAlpha"
                  width={{ base: "100%", md: "auto" }}
                  flex={{ base: "1 1 100%", md: "none" }}
                >
                  Learn More
                </Button>
                <Button
                  as={RouterLink}
                  to="/playground"
                  variant="outline"
                  colorScheme="blackAlpha"
                  width={{ base: "100%", md: "auto" }}
                  flex={{ base: "1 1 100%", md: "none" }}
                >
                  Playground
                </Button>
              </Flex>
            </VStack>
          </Box>

          <Box
            className="animated-box3"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <VStack align="flex-start" spacing={4} p={10}>
              <Heading as="h3" size="lg">
                Measure Expression
              </Heading>
              <Text style={{ lineHeight: "1.8em" }}>
                Use psychologically valid models of facial movement and vocal
                modulation.
              </Text>
              <Flex
                flexDirection="row"
                justify="center"
                align="center"
                gap={4}
                wrap="wrap"
              >
                <Image src={images.ecnomicGraph} borderRadius="md" />
                <Button
                  as={RouterLink}
                  to="#"
                  variant="solid"
                  colorScheme="blackAlpha"
                  width={{ base: "100%", md: "auto" }}
                  flex={{ base: "1 1 100%", md: "none" }}
                >
                  Start with Webcam
                </Button>
                <Button
                  as={RouterLink}
                  to="#"
                  variant="outline"
                  colorScheme="blackAlpha"
                  borderRadius="full"
                  borderWidth="2px"
                  borderColor="blackAlpha.500"
                  width={{ base: "100%", md: "auto" }}
                  flex={{ base: "1 1 100%", md: "none" }}
                >
                  Documentation
                </Button>
              </Flex>
            </VStack>
          </Box>

          <Box
            className="animated-box4"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <VStack align="flex-start" spacing={4} p={10}>
              <Heading as="h3" size="lg">
                Interpret Expressive Communication
              </Heading>
              <Text style={{ lineHeight: "1.8em" }}>
                Start building with the world's first emotionally intelligent
                voice AI.
              </Text>
              <Flex
                flexDirection="row"
                justify="center"
                align="center"
                gap={4}
                wrap="wrap"
              >
                <Image src={images.graphThree} borderRadius="md" />
                <Button
                  as={RouterLink}
                  to="#"
                  variant="solid"
                  colorScheme="blackAlpha"
                  width={{ base: "100%", md: "auto" }}
                  flex={{ base: "1 1 100%", md: "none" }}
                >
                  Use Custom Models
                </Button>
                <Button
                  as={RouterLink}
                  to="#"
                  variant="outline"
                  colorScheme="blackAlpha"
                  borderRadius="full"
                  borderWidth="2px"
                  borderColor="blackAlpha.500"
                  width={{ base: "100%", md: "auto" }}
                  flex={{ base: "1 1 100%", md: "none" }}
                >
                  Documentation
                </Button>
              </Flex>
            </VStack>
          </Box>
        </SimpleGrid>
        <BarGraph />
      </Box>
    </>
  );
};
