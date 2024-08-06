import { React, useRef, useState } from "react";
import {
  VStack,
  Heading,
  Box,
  Image,
  Text,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Select,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { GiHealthIncrease } from "react-icons/gi";
import { FaPills } from "react-icons/fa";
import { TbLetterS, TbLetterL, TbTestPipe } from "react-icons/tb";

const ActionItem = ({ action, isLongTerm }) => (
  <Tooltip
    label={isLongTerm ? "Long Term" : "Short Term"}
    placement="top-start"
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

const TestDetails = ({ test, score }) => (
  <Box mb={3}>
    {/* <Progress
      value={score}
      colorScheme={score > 80 ? "green" : score > 60 ? "yellow" : "red"}
      height="8px"
      borderRadius="full"
    /> */}
    <Text mt={1} fontSize="sm" color="gray.600">
      Result: {test.result}
    </Text>
    <Text mt={1} fontSize="sm" color="gray.600">
      Normal Range: {test.range}
    </Text>
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

const RecommendationsMB = ({ medData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
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
    <>
      <Button
        p={3}
        backgroundColor="red.100"
        _hover={{ backgroundColor: "red.200" }}
        leftIcon={<Icon as={GiHealthIncrease} boxSize={7} color="red.500" />}
        onClick={onOpen}
        ref={btnRef}
      >
        View Recommendations
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        size="3xl"
        motionPreset="scale"
        isCentered
      >
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent bg="none">
          <Box
            borderWidth={2}
            borderColor="black"
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            bg="white"
            p={6}
          >
            <ModalCloseButton />
            <VStack alignItems="flex-end" spacing={5}>
              <Box flex={1} width="100%">
                <Heading align="center" size="lg" mb={4}>
                  Improving {medData.name}
                </Heading>
                <Divider mb={4} />
                <HStack justify="space-between" mb={2}>
                  {/* <Text fontWeight="bold">{test.name}</Text> */}
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

                <Heading size="md" mb={3}>
                  Recommended Actions:
                </Heading>
                <SimpleGrid columns={2} spacing={4} width="100%">
                  {medData.actionPlan.shortTerm.map((action, index) => (
                    <ActionItem
                      key={`short-${index}`}
                      action={action}
                      isLongTerm={false}
                    />
                  ))}
                  {medData.actionPlan.longTerm.map((action, index) => (
                    <ActionItem
                      key={`long-${index}`}
                      action={action}
                      isLongTerm={true}
                    />
                  ))}
                </SimpleGrid>
              </Box>
              <Button
                onClick={onClose}
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
            </VStack>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecommendationsMB;
