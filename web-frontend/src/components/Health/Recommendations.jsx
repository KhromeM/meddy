import { React, useRef, useState } from "react";
import {
  Heading,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Icon,
  Divider,
  Select,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { FaPills } from "react-icons/fa";
import { TbClock, TbCalendarTime, TbTestPipe } from "react-icons/tb";

const TestDetails = ({ test }) => (
  <Box mb={3}>
    <Heading size="md" mb={2}>
      {test.name}
    </Heading>
    {/* Progress Bar Here */}
    <Text>Name: {test.name || "N/A"}</Text>
    <Text>Result: {test.result || "N/A"}</Text>
    <Text>Range: {test.range || "N/A"}</Text>

    <Box mt={4} borderWidth={1} borderRadius="md" p={4}>
      <HStack>
        <Icon as={FaPills} boxSize={7} color="blue.500" />
        <Box>
          <Text fontWeight="bold" mb={2}>
            Suggestion
          </Text>
          <Text fontSize="sm">{test.recommendation}</Text>
        </Box>
      </HStack>
    </Box>
  </Box>
);

const Recommendations = ({ medData }) => {
  const [selectedTest, setSelectedTest] = useState("goldTest");

  const tests = [
    { value: "goldTest", label: medData.details.goldTest.name },
    ...medData.details.secondaryTests.map((test, index) => ({
      value: `secondaryTest${index}`,
      label: test.name,
    })),
  ];

  const getCurrentTest = () => {
    if (selectedTest === "goldTest") {
      return medData.details.goldTest;
    } else {
      const index = parseInt(selectedTest.replace("secondaryTest", ""));
      return medData.details.secondaryTests[index];
    }
  };

  return (
    <Box flex={1} width="100%">
      <HStack justify="space-between" mb={2}>
        <Text
          color={
            medData.score > 80
              ? "green.500"
              : medData.score > 60
              ? "yellow.500"
              : "red.500"
          }
        >
          {medData.score > 80
            ? "Optimal"
            : medData.score > 60
            ? "Fair"
            : "Needs Improvement"}
        </Text>
      </HStack>
      <Text mb={4}>{medData.generalRecommendation}</Text>

      <Divider mb={4} />

      <Flex align="center" justify="flex-start" mb={3}>
        <Icon as={TbTestPipe} boxSize={8} color="red.500" mr={2} />
        <Select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          width="auto"
        >
          {tests.map((test) => (
            <option key={test.value} value={test.value}>
              {test.label}
            </option>
          ))}
        </Select>
      </Flex>
      <TestDetails test={getCurrentTest()} />

      <Heading size="md" mb={2}>
        Recommendations
      </Heading>
      <Text mb={4}>
        Based on your {medData.name.toLowerCase()} health score, here are some
        recommendations to improve your health:
      </Text>
      <VStack spacing={4} width="100%" align="stretch">
        <Box bg="blue.100" p={3} borderRadius="xl">
          <Flex align="center" mb={3}>
            <Icon as={TbClock} color="blue.500" boxSize={6} mr={1.5} />
            <Heading size="sm" color="blue.500">
              Short Term Recommendations
            </Heading>
          </Flex>
          <SimpleGrid columns={1} spacing={1}>
            {medData.actionPlan.shortTerm.map((action, index) => (
              <Box
                key={index}
                borderWidth={1}
                borderRadius="md"
                p={4}
                bg="white"
                borderColor="blue.300"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Text>{action}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box bg="purple.100" p={3} borderRadius="xl">
          <Flex align="center" mb={3}>
            <Icon as={TbCalendarTime} color="purple.500" boxSize={6} mr={1.5} />
            <Heading size="sm" color="purple.500">
              Long Term Recommendations
            </Heading>
          </Flex>
          <SimpleGrid columns={1} spacing={1}>
            {medData.actionPlan.longTerm.map((action, index) => (
              <Box
                key={index}
                borderWidth={1}
                borderRadius="md"
                p={4}
                bg="purple.50"
                borderColor="purple.300"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Text>{action}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default Recommendations;
