import { React, useRef } from "react";
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
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { FaHeartbeat, FaAppleAlt, FaRunning, FaPills } from "react-icons/fa";
import { GiHealthIncrease } from "react-icons/gi";

const RecommendationsMB = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = useRef(null);
  return (
    <>
      <Button
        p={3}
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
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          // backdropInvert="80%"
          backdropBlur="1px"
        />
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
              {/* Main content */}
              <Box flex={1}>
                <Heading size="lg" mb={4}>
                  Reduce Heart Disease Risk
                </Heading>
                <Divider mb={4} />
                <Text mb={4}>
                  Heart disease is the #1 killer in the United States. The
                  traditional approach to cardiovascular disease prevention is
                  to intervene based on your 10-year risk of heart disease. This
                  is problematic because it may lead to under- treatment of
                  younger individuals. At Meddy, we prefer to look at members'
                  30-year risk of heart disease, paying particular attention to
                  the biomarkers apoB and Lp(a).
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
