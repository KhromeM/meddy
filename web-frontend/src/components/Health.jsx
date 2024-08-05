import React, { useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";
import { Gradient } from "./Gradient"; // Import the Gradient class
import "../styles/gradient.css"; // Import the gradient CSS

const HealthCard = ({ category }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="md"
        _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}
      >
        <Heading size="md" mb={2}>
          {category.name}
        </Heading>
        <Text fontWeight="bold">Score: {category.score}</Text>
        <Progress
          value={category.score}
          colorScheme={
            category.score > 80
              ? "green"
              : category.score > 60
              ? "yellow"
              : "red"
          }
          mb={2}
        />
        <Text fontSize="sm" mb={2} noOfLines={2}>
          {category.oneLineSummary}
        </Text>
        <Text fontSize="sm" mb={1}>
          Gold Standard Test: {category.goldTest}
        </Text>
        <Text fontSize="sm" mb={1}>
          Result: {category.result}
        </Text>
        <Text fontSize="sm" mb={2}>
          Normal Range: {category.range}
        </Text>
        <Button size="sm" onClick={onOpen}>
          View Recommendations
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{category.name} Recommendations</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{category.recommendation}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Health = () => {
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

  const healthCategories = [
    {
      name: "Metabolic Health",
      score: 85,
      oneLineSummary:
        "Your metabolic health is good, but there&aposs room for improvement.",
      goldTest: "HbA1c",
      result: "5.2%",
      range: "4.0% - 5.6%",
      recommendation:
        "Consider incorporating more whole grains and reducing processed sugar intake to further improve your metabolic health.",
    },
    {
      name: "Heart Health",
      score: 92,
      oneLineSummary: "Your heart health is excellent. Keep up the good work!",
      goldTest: "Coronary Calcium Score",
      result: "0",
      range: "0 - 10",
      recommendation:
        "Maintain your current heart-healthy lifestyle. Consider adding more omega-3 rich foods to your diet.",
    },
    {
      name: "Gut Health",
      score: 78,
      oneLineSummary:
        "Your gut health is within normal range, but could use some attention.",
      goldTest: "Comprehensive Stool Analysis",
      result: "See details",
      range: "Varies by marker",
      recommendation:
        "Increase your intake of probiotic-rich foods and consider a high-quality probiotic supplement.",
    },
    {
      name: "Brain Health",
      score: 88,
      oneLineSummary:
        "Your cognitive function is strong. Keep challenging your brain!",
      goldTest: "Quantitative EEG",
      result: "Normal patterns",
      range: "Normal frequency distribution",
      recommendation:
        "Engage in regular cognitive exercises and ensure you&aposre getting enough quality sleep.",
    },
    {
      name: "Immune System",
      score: 82,
      oneLineSummary: "Your immune system is functioning well.",
      goldTest: "Complete Blood Count",
      result: "Within normal limits",
      range: "Varies by cell type",
      recommendation:
        "Consider adding more vitamin C and zinc-rich foods to your diet to further boost your immune system.",
    },
    {
      name: "Musculoskeletal Health",
      score: 79,
      oneLineSummary:
        "Your musculoskeletal health is good, but there&aposs room for improvement.",
      goldTest: "DEXA Scan",
      result: "T-score: -0.5",
      range: "T-score: -1.0 to +1.0",
      recommendation:
        "Incorporate more weight-bearing exercises and ensure adequate calcium and vitamin D intake.",
    },
    {
      name: "Hormonal Profile",
      score: 86,
      oneLineSummary: "Your hormonal balance is within optimal range.",
      goldTest: "Comprehensive Hormone Panel",
      result: "See detailed report",
      range: "Varies by hormone",
      recommendation:
        "Maintain a balanced diet and regular exercise routine to support hormonal health.",
    },
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
            <Heading size="xl" textAlign="center" color="white">
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
