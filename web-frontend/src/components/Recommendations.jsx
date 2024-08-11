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
	useColorModeValue,
} from "@chakra-ui/react";
import { FaPills } from "react-icons/fa";
import { TbClock, TbCalendarTime, TbTestPipe } from "react-icons/tb";
import Card from "./Card/Card";

const TestDetails = ({ test }) => {
	const bgColor = useColorModeValue("white", "gray.600");

	return (
    <Box mb={3}>
      <Heading size="md" mb={2} color="#0e3c26">
        {test.name}
      </Heading>
      <Text color="#0e3c26">
        <strong>Result:</strong> {test.result || "N/A"}
      </Text>
      <Text color="#0e3c26">
        <strong>Range:</strong> {test.range || "N/A"}
      </Text>

      <Box mt={4} borderWidth={1} borderRadius="md" bg="#F5E9DB" p={4}>
        <HStack>
          <Icon as={FaPills} boxSize={7} color="#058247" />
          <Box>
            <Text fontWeight="bold" mb={2} color="#0e3c26">
              Suggestion
            </Text>
            <Text fontSize="sm" color="#0e3c26">
              {test.recommendation}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

const Recommendations = ({ medData }) => {
	const [selectedTest, setSelectedTest] = useState("goldTest");
	const bgColor = useColorModeValue("white", "#FAF3EA");

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
    <Card bg="#FAF3EA" height="100%">
      <Box flex={1} width="100%">
        <HStack justify="space-between" mb={1}>
          <Text
            as="h2"
            fontSize="3xl"
            fontWeight={600}
            color={
              medData.score > 80
                ? "#058247"
                : medData.score > 60
                ? "#299563"
                : "#FF6B6B"
            }
          >
            {medData.score > 80
              ? "Optimal"
              : medData.score > 60
              ? "Fair"
              : "Needs Improvement"}
          </Text>
        </HStack>
        <Text mb={4} color="#0e3c26">
          {medData.generalRecommendation}
        </Text>

        <Divider borderColor="#0e3c26" mb={4} />

        <Flex align="center" justify="flex-start" mb={6}>
          <Icon as={TbTestPipe} boxSize={8} color="red.500" mr={2} />
          <Select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            width="auto"
            bg="#F5E9DB"
            color="#0e3c26"
            borderColor="#058247"
            _hover={{ borderColor: "#299563" }}
          >
            {tests.map((test) => (
              <option key={test.value} value={test.value}>
                {test.label}
              </option>
            ))}
          </Select>
        </Flex>
        {/* <Divider mb={4} /> */}

        <TestDetails test={getCurrentTest()} />
      </Box>

      {/* <Heading size="md" mb={2}>
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
      </VStack> */}
    </Card>
  );
};

export const RecommendationsAction = ({ medData }) => {
	const bgColor = useColorModeValue("white", "gray.600");

	return (
    <Card bg="#FAF3EA">
      <Heading size="md" mb={2}>
        Recommendations
      </Heading>
      <Heading size="sm" fontWeight={400} color="gray.500" mb={4}>
        Based on your {medData.name.toLowerCase()} health score, here are some
        recommendations to improve your health:
      </Heading>
      {/* <VStack spacing={4} width="100%" align="stretch"> */}
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
        <Box bg="#F5E9DB" p={3} borderRadius="xl">
          <Flex align="center" mb={3}>
            <Icon as={TbClock} color="#058247" boxSize={6} mr={1.5} />
            <Heading size="sm" color="#0e3c26">
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
                // bg="white"
                bg="#FAF3EA"
                borderColor="#058247"
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
                // bg="purple.50"
                bg={bgColor}
                borderColor="purple.300"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Text>{action}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      {/* </VStack> */}
    </Card>
  );
};

export default Recommendations;
