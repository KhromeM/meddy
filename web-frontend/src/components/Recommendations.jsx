import React from "react";
import {
  VStack,
  Heading,
  Box,
  Container,
  Image,
  Text,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { FaHeartbeat, FaAppleAlt, FaRunning, FaPills } from "react-icons/fa";
import { useEffect } from "react";
import { Gradient } from "./Gradient"; // Import the Gradient class
import "../styles/gradient.css"; // Import the gradient CSS

const Recommendations = () => {
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
    <Box
      position="relative"
      minHeight="100vh"
      w="full"
      overflow="hidden"
      bg="transparent"
    >
      <canvas
        id="gradient-canvas"
        data-js-darken-top
        data-transition-in
      ></canvas>
      <Box minHeight="100vh" py={12}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading textAlign="center" size="2xl">
              Meddy Recommendations
            </Heading>

            <Box
              borderWidth={2}
              borderColor="black"
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
              bg="white"
              p={6}
            >
              <HStack alignItems="flex-start" spacing={5} br="red">
                {/* Sidebar */}
                <VStack
                  width="200px"
                  alignItems="flex-start"
                  borderRightWidth={2}
                  borderRightColor="black"
                >
                  <Button variant="ghost" leftIcon={<FaHeartbeat />} isActive>
                    Heart health
                  </Button>
                  <Button variant="ghost" leftIcon={<FaAppleAlt />}>
                    Gut health
                  </Button>
                  <Button variant="ghost" leftIcon={<FaRunning />}>
                    Fitness
                  </Button>
                  <Button variant="ghost" leftIcon={<FaPills />}>
                    Supplements
                  </Button>
                </VStack>

                {/* Main content */}
                <Box flex={1}>
                  <Heading size="lg" mb={4}>
                    Reduce Heart Disease Risk
                  </Heading>
                  <Text mb={4}>
                    Heart disease is the #1 killer in the United States. The
                    traditional approach to cardiovascular disease prevention is
                    to intervene based on your 10-year risk of heart disease.
                    This is problematic because it may lead to under- treatment
                    of younger individuals. At Meddy, we prefer to look at
                    members' 30-year risk of heart disease, paying particular
                    attention to the biomarkers apoB and Lp(a).
                  </Text>

                  <Box mb={6}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">Lipoprotein (a)</Text>
                      <Text color="green.500">Optimal</Text>
                    </HStack>
                    <Progress
                      value={20}
                      colorScheme="green"
                      height="8px"
                      borderRadius="full"
                    />
                    <Text mt={1} fontSize="sm" color="gray.600">
                      9 ng/mL
                    </Text>
                  </Box>

                  <Heading size="md" mb={3}>
                    To lower these biomarker levels you should:
                  </Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    {[
                      "Eat the right fat: avoid trans & polyunsaturated fats; minimize saturated fat, prioritize monounsaturated fat",
                      "Eat right: 1g protein per lb of bodyweight, eat few carbs, avoid seed oils",
                      "Get the right micronutrients, especially magnesium, zinc, K, A, E, C, and B vitamins",
                      "Take a select few supplements, where necessary",
                    ].map((recommendation, index) => (
                      <Box key={index} borderWidth={1} borderRadius="md" p={3}>
                        <Text>{recommendation}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>

                  <Box mt={6} borderWidth={1} borderRadius="md" p={4}>
                    <HStack>
                      <Icon as={FaPills} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold">Red yeast rice & CoQ10</Text>
                        <Text fontSize="sm">
                          Has been repeatedly shown to help lower lipid levels.
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </Box>
              </HStack>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  window.history.back();
                }}
                className="back-button"
                leftIcon={
                  <Image
                    src="/assets/svg-9b.svg"
                    boxSize="1.5rem"
                    alt="Web icon"
                    className="back-icon"
                  />
                }
                variant="solid"
              >
                Take me back
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Recommendations;