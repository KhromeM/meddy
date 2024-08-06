import React, { useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Progress,
  Badge,
  HStack,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { Gradient } from "./Gradient";
import "../styles/gradient.css";
import RecommendationsMB from "./Recommendations";
import medicalRecord from "./MedicalRecord.json";

const HealthCard = ({ category }) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading align="center" size="md" mb={4} fontWeight="bold">
        {category.name}
      </Heading>

      <VStack align="stretch" spacing={4} flex={1}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Score:</Text>
          <Badge
            colorScheme={
              category.score > 80
                ? "green"
                : category.score > 60
                ? "yellow"
                : "red"
            }
            fontSize="md"
            py={1}
            px={2}
            borderRadius="full"
          >
            {category.score}
          </Badge>
        </HStack>
        <Progress
          value={category.score}
          colorScheme={
            category.score > 80
              ? "green"
              : category.score > 60
              ? "yellow"
              : "red"
          }
          borderRadius="full"
          size="sm"
        />
        <Text fontSize="sm" fontStyle="italic">
          {category.oneLineSummary}
        </Text>
        <Divider />
        <VStack align="stretch" spacing={3}>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Gold Standard Test:
            </Text>
            <Text fontSize="sm">{category.details.goldTest.name}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Result:
            </Text>
            <Text fontSize="sm">{category.details.goldTest.result}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Normal Range:
            </Text>
            <Text fontSize="sm">{category.details.goldTest.range}</Text>
          </Box>
        </VStack>
        <Spacer />
      </VStack>

      <RecommendationsMB medData={category} />
    </Box>
  );
};

const Health = () => {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  const healthCategories = [
    medicalRecord.metabolicHealth,
    medicalRecord.heartHealth,
    medicalRecord.gutHealth,
    medicalRecord.brainHealth,
    medicalRecord.immuneSystem,
    medicalRecord.musculoskeletalHealth,
    medicalRecord.hormonalProfile,
  ];

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
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      ></canvas>
      <Box position="relative" minHeight="100vh" py={12}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading size="xl" textAlign="center" color="black">
              Your Health Summary
            </Heading>
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
              {healthCategories.map((category) => (
                <HealthCard key={category.name} category={category} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Health;
