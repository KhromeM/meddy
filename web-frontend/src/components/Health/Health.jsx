import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  CircularProgress,
  Spinner,
  useColorModeValue,
  CircularProgressLabel,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { Gradient } from "../Gradient";
import "../../styles/gradient.css";
import Recommendations from "./Recommendations.jsx";

const HealthSystemTab = ({ category, isSelected }) => {
  const bgColor = useColorModeValue(
    isSelected ? "white" : "gray.100",
    isSelected ? "gray.700" : "gray.600"
  );
  const borderColor = useColorModeValue(
    isSelected ? "#FACC87" : "transparent",
    isSelected ? "#FACC87" : "transparent"
  );
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Tab
      py={2}
      px={4}
      borderTopRadius="md"
      bg={bgColor}
      color={textColor}
      fontWeight="medium"
      fontSize="sm"
      _selected={{
        bg: bgColor,
        color: textColor,
        borderTop: "2px solid",
        borderColor: borderColor,
        borderBottom: "none",
      }}
      _hover={{ bg: isSelected ? bgColor : "gray.200" }}
      transition="all 0.2s"
      mr={1}
    >
      {category.name.split(" ")[0]}
    </Tab>
  );
};

const HealthSystemContent = ({ category }) => {
  const getColorScheme = (score) => {
    if (score > 80) return "green";
    if (score > 60) return "yellow";
    return "red";
  };

  return (
    <Box>
      <HStack spacing={6} mb={6}>
        <CircularProgress
          value={category.score}
          size="120px"
          thickness="12px"
          color={getColorScheme(category.score)}
        >
          <CircularProgressLabel fontWeight="bold" fontSize="2xl">
            {category.score}%
          </CircularProgressLabel>
        </CircularProgress>
        <VStack align="start" spacing={2}>
          <Heading size="lg">{category.name}</Heading>
          <Text fontSize="md">{category.oneLineSummary}</Text>
        </VStack>
      </HStack>
      <Divider mb={6} />
      <VStack align="start" spacing={4}>
        <Recommendations medData={category} />
      </VStack>
    </Box>
  );
};

const HealthPanel = () => {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch(
          "https://trymeddy.com/api/medical-record/",
          {
            headers: {
              idtoken: "dev",
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch health data");
        }
        const data = await response.json();
        setHealthData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Text>Error: {error}</Text>
      </Box>
    );
  }

  const healthCategories = [
    healthData.metabolicHealth,
    healthData.heartHealth,
    healthData.gutHealth,
    healthData.brainHealth,
    healthData.immuneSystem,
    healthData.musculoskeletalHealth,
    healthData.hormonalProfile,
  ];

  return (
    <Box
      position="relative"
      minHeight="100%"
      w="full"
      overflow="hidden"
      borderRadius="lg"
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
      <Container maxW="container.xl" py={5}>
        <VStack spacing={7} align="stretch">
          <Heading size="xl" textAlign="center" mb={0} color="black">
            Your Health Summary
          </Heading>
          <Box
            borderWidth={1}
            borderColor={borderColor}
            borderRadius="md"
            overflow="hidden"
            bg={bgColor}
          >
            <Tabs
              index={selectedIndex}
              onChange={setSelectedIndex}
              variant="unstyled"
            >
              <TabList borderBottomWidth={1} borderColor={borderColor}>
                <HStack spacing={0} overflowX="auto" py={2} px={4}>
                  {healthCategories.map((category, index) => (
                    <HealthSystemTab
                      key={category.name}
                      category={category}
                      isSelected={index === selectedIndex}
                    />
                  ))}
                </HStack>
              </TabList>
              <TabPanels>
                {healthCategories.map((category) => (
                  <TabPanel key={category.name} p={6}>
                    <HealthSystemContent category={category} />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HealthPanel;
