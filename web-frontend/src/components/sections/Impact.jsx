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
    title: "Digital Records",
    description:
      "By listening in on your appointments and integrating with Epic, Meddy tracks of all your medications, conditions and health metrics. This helps cut down on paper usage, which makes up 54% of hospital waste. We give you complete control over your information, giving you instant access and editing. Keeping all your data in one place minimizes bureaucracy and allows doctors to focus on their patients instead of digging through records.",
    url: setReminderFlutterGif,
  },
  {
    title: "Multilingual Support",
    description:
      "70,7% of Limited English Proficienty patients reported limited access to interpreters, and 50% believe the language barrier contributed to errors. Meddy bridges this gap with real-time translation. By auto-detecting language in voice and chat, and translating our app, we aim to reduce the friction in treating patients from diverse linguistic backgrounds.",
    url: spanishMedicineIdentificationGif,
  },
  {
    title: "Medication Reminders",
    description:
      "We give you an easy way to keep track of your medication regimes. Whether you prefer voice commands or UI, we give you a simple way to adhere to your prescription. A staggering two thirds of prescribed medications are unused, in large part due to forgetfulness. Avoid wasting money and risking adverse effects with Meddy.",
    url: setReminderFlutterGif,
  },
  {

    title: "Health Education",
    description:
      "We summarize all your medical data and display it in an easily digestible fashion, giving you a quick overview of your health status. On that same page, we give you actionable tips to improve your general wellbeing tailored to your specific situation.",
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

        <Heading as="h2" size="xl" mb={4} pl={4} fontSize="48px" marginTop="50px" marginBottom="40px">
          How Meddy Makes an Impact

        </Heading>
        <Accordion allowToggle defaultIndex={[0]}>
          {features.map((feature, index) => (
            <AccordionItem
              key={index}
              border={"2px solid #E2E8F0"}
              marginBottom={10} // Increased the margin-bottom for more space
              borderRadius={16}
              p={4} // Added padding for better spacing inside each item
            >
              {({ isExpanded }) => (
                <>
                  <h3>
                    <AccordionButton onClick={() => updateImage(feature.url)}>
                      <Box
                        flex="1"
                        textAlign="left"
                        fontWeight={isExpanded ? "semibold" : "light"}
                        height="50px"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize="18px"
                      >
                        {feature.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4}>
                    <Text lineHeight="1.8">{feature.description}</Text>
                  </AccordionPanel>
                </>
              )}
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
        /></Box>
    </Flex>

  );
};

export default Impact;