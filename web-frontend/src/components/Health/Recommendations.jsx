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
  Tooltip,
} from "@chakra-ui/react";
import { FaPills } from "react-icons/fa";
import { TbLetterS, TbLetterL, TbTestPipe } from "react-icons/tb";

const ActionItem = ({ action, isLongTerm }) => (
  <Tooltip
    openDelay={1000}
    label={isLongTerm ? "Long Term Suggestion" : "Short Term Suggestion"}
    placement="top-start"
    bg="#FACC87"
    borderRadius="xl"
    mb={-5}
  >
    <Box
      borderWidth={1}
      borderRadius="md"
      p={3}
      bg={isLongTerm ? "blue.50" : "green.50"}
      borderColor={isLongTerm ? "blue.200" : "green.200"}
    >
      <Flex align="center">
        <Icon
          as={isLongTerm ? TbLetterL : TbLetterS}
          color={isLongTerm ? "blue.500" : "green.500"}
          boxSize={5}
          mr={3}
        />
        <Text>{action}</Text>
      </Flex>
    </Box>
  </Tooltip>
);

const TestDetails = ({ test }) => (
  <Box mb={3}>
    <Heading size="md" mb={2}>
      {test.name}
    </Heading>
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
      <TestDetails test={getCurrentTest()} score={medData.score} />

      <Heading size="md" mb={2}>
        Recommendations
      </Heading>
      <Text mb={4}>
        Based on your {medData.name.toLowerCase()} health score, here are some
        recommendations to improve your health:
      </Text>
      <SimpleGrid columns={1} spacing={4} width="100%">
        {medData.actionPlan.shortTerm.map((action, index) => (
          <ActionItem
            key={`short-${index}`}
            action={action}
            isLongTerm={false}
          />
        ))}
        {medData.actionPlan.longTerm.map((action, index) => (
          <ActionItem key={`long-${index}`} action={action} isLongTerm={true} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Recommendations;
