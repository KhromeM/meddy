import React, { useState } from "react";
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
  AccordionIcon,
} from "@chakra-ui/react";
import spanishMedicineIdentificationGif from "../../assets/gif/spanish-medicine-identification.gif";
import spanishAudioModeFlutterGif from "../../assets/gif/spanish-audio-mode-flutter.gif";
import setReminderFlutterGif from "../../assets/gif/set-reminder-flutter.gif";
import flutterHealthPageGif from "../../assets/gif/flutter-health-page.gif";
import "../../styles/animatedBG.css";

const features = [
  {
    title: "Multilingual Support",
    description:
      "Our AI-powered translation ensures clear communication between patients and healthcare providers.",
    url: spanishMedicineIdentificationGif,
  },
  {
    title: "Medication Reminders",
    description:
      "Timely notifications help patients adhere to their medication schedules, improving overall health outcomes.",
    url: setReminderFlutterGif,
  },
  {
    title: "Digital Prescriptions",
    description:
      "Reduce paper waste and improve accuracy with our digital prescription system.",
    url: spanishAudioModeFlutterGif,
  },
  {
    title: "Health Education",
    description:
      "Provide patients with easy-to-understand information about their conditions and treatments.",
    url: flutterHealthPageGif,
  },
];

const Impact = () => {
  const [image, setImage] = useState(spanishMedicineIdentificationGif);

  const updateImage = (imageUrl) => {
    setImage(imageUrl);
  };

  return (
    <Flex
      align="flex-start"
      justify="space-between"
      p={8}
      flexDirection={{ base: "column", md: "row" }}
    >
      <Box flex={[1, 2, 2]} mr={[0, 20]} mb={[8, 0]}>
        <Heading as="h2" size="xl" mb={4} pl={4} fontSize="48px">
          How Meddy Makes an Impact
        </Heading>
        <Accordion allowToggle>
          {features.map((feature, index) => (
            <AccordionItem
              key={index}
              border={"2px solid #E2E8F0"}
              marginBottom={4}
              borderRadius={16}
            >
              <h3>
                <AccordionButton onClick={() => updateImage(feature.url)}>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontWeight="semibold"
                    height="50px"
                    display={"flex"}
                    alignItems={"center"}
                  >
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
          src={image}
          alt="Empathic Voice Interface"
          borderRadius="20px"
          width="100%"
          objectFit="cover"
        />
      </Box>
    </Flex>
  );
};

export default Impact;
