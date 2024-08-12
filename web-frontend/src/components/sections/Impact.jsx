import React from "react";
import {
  Box,
  Image,
  Text,
  Flex,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from "@chakra-ui/react";
import homeScreen from "../../assets/img/home-screenshot.png";
import "../../styles/animatedBG.css";

const features = [
  {
    title: "Multilingual Support",
    description: "Our AI-powered translation ensures clear communication between patients and healthcare providers."
  },
  {
    title: "Medication Reminders",
    description: "Timely notifications help patients adhere to their medication schedules, improving overall health outcomes."
  },
  {
    title: "Digital Prescriptions",
    description: "Reduce paper waste and improve accuracy with our digital prescription system."
  },
  {
    title: "Health Education",
    description: "Provide patients with easy-to-understand information about their conditions and treatments."
  }
];

const Impact = () => {
  return (
    <Flex direction={["column", "row"]} align="flex-start" justify="space-between" p={8}>
      <Box flex={[1, 2, 2]} mr={[0, 20]} mb={[8, 0]} >
        <Heading as="h2" size="xl" mb={4} pl={4} fontSize="48px">
          How Meddy Makes an Impact
        </Heading>
        <Accordion allowToggle>
          {features.map((feature, index) => (
            <AccordionItem key={index}>
              <h3>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold" height="50px">
                    {feature.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4}>
                <Text>{feature.description}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
      <Box flex={1}>
        <Image
          src={homeScreen}
          alt="Empathic Voice Interface"
          borderRadius="20px"
          boxShadow="lg"
          width="100%"
          objectFit="cover"
        />
      </Box>
    </Flex>
  );
};

export default Impact;