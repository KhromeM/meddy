import React from "react";
import {
  VStack,
  Heading,
  SimpleGrid,
  Box,
  Text,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";

import { IoMdChatboxes } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { LuShieldAlert } from "react-icons/lu";
import { color } from "framer-motion";

const FeatureBox = ({ description }) => {
  const boxWidth = useBreakpointValue({
    base: "100%",
    xl: "25rem",
  });

  return (
    <Box
      borderWidth={0.5}
      borderRadius="lg"
      p={6}
      width={boxWidth}
      height="80px"
      borderColor={"#944A55"}
      bg={"#fff"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.3s"
      _hover={{
        bg: "#fff5df",
        boxShadow: "lg",
        transform: "scale(1.01)",
      }}
    >
      <Text fontSize="sm" lineHeight={"1.5rem"} textAlign="left">
        {description}
      </Text>
    </Box>
  );
};

const InitialView = () => (
  <VStack spacing={8} align="stretch" mt={8}>
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      spacing={8}
      alignSelf={"center"}
    >
      <VStack align="center" spacing={4}>
        <Icon as={IoMdChatboxes} boxSize={6} mb={2} />
        <Heading size="md">Examples</Heading>
        <FeatureBox
          description='"What are the benefits of sunlight for mental health?"'
        />
        <FeatureBox
          description='"Set a reminder for 10am 8/02 for a blood test"'
        />
        <FeatureBox
          description='"How often should I go to the dentist?"'
        />
      </VStack>
      <VStack align="center" spacing={4}>
        <Icon as={BsStars} boxSize={6} mb={2} />
        <Heading size="md">Capabilities</Heading>
        <FeatureBox
          description="Supports text and audio prompts in multiple languages"
        />
        <FeatureBox
          description="Syncs with epic, giving you easy access to your data"
        />
        <FeatureBox
          description="High context window, allowing long chats"
        />
      </VStack>
      <VStack align="center" spacing={4}>
        <Icon as={LuShieldAlert} boxSize={6} mb={2} />
        <Heading size="md">Limitations</Heading>
        <FeatureBox
          description="May occasionally generate incorrect information."
        />
        <FeatureBox
          description="May occasionally produce harmful instructions or biased content."
        />
        <FeatureBox
          description="Limited knowledge of world and events after 2021."
        />
      </VStack>
    </SimpleGrid>
  </VStack>
);

export default InitialView;