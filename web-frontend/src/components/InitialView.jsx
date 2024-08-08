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
import Card from "./Card/Card";

const FeatureBox = ({ icon, title, description }) => {
  const boxWidth = useBreakpointValue({
    base: "100%",
    xl: "25rem",
  });

  return (
    <Card
      // borderWidth={1}
      // borderRadius="lg"
      // p={4}
      // width={boxWidth}
      // mb={4}
      borderColor={"#843A05"}
      // height={"100%"}
      // bg={"#fff"}
    >
      <Text fontSize="md" height={"34px"} lineHeight={"1.5rem"}>
        {description}
      </Text>
    </Card>
  );
};

const InitialView = () => (
  <VStack spacing={8} align="stretch" mt={8}>
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      height={"100%"}
      spacing={8}
      alignSelf={"center"}
    >
      <VStack align="center" spacing={4}>
        <Icon as={IoMdChatboxes} boxSize={6} mb={2} />

        <Heading size="md">Examples</Heading>

        <FeatureBox
          title="Using your medical records."
          description='"What are the benefits of sunlight for mental health?"'
        />
        <FeatureBox
          title="Mental Health"
          description='"Set a reminder for 10am 8/02 for a blood test"'
        />
        <FeatureBox
          title="Long Chats"
          description='"How often should I go to the dentist?"'
        />
      </VStack>
      <VStack align="center" spacing={4}>
        <Icon as={BsStars} boxSize={6} mb={2} />

        <Heading size="md">Capabilities</Heading>
        <FeatureBox
          title="Multiple Languages"
          description="Supports text and audio prompts in multiple languages"
        />
        <FeatureBox
          title="Sync with Epic"
          description="Syncs with epic, giving you easy access to your data"
        />
        <FeatureBox
          title="Long Chats"
          description="High context window, allowing long chats"
        />
      </VStack>
      <VStack align="center" spacing={4}>
        <Icon as={LuShieldAlert} boxSize={6} mb={2} />

        <Heading size="md">Limitations</Heading>
        <FeatureBox
          title="Information Accuracy"
          description="May occasionally generate incorrect information."
        />
        <FeatureBox
          title="Content Safety"
          description="May occasionally produce harmful instructions or biased content."
        />
        <FeatureBox
          title="Knowledge Cutoff"
          description="Limited knowledge of world andevents after 2021."
        />
      </VStack>
    </SimpleGrid>
  </VStack>
);

export default InitialView;
