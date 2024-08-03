import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  SimpleGrid,
  Divider,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useAuth } from "../firebase/AuthService.jsx";
import eviImage from "../../assets/image.png";

export const EVI = () => {
  const { login } = useAuth();
  
  const containerWidth = useBreakpointValue({ base: "90%", md: "80%", lg: "70%" });

  const theme = useTheme();

  return (
    <Box position="relative" bg="white" color="gray.800" fontFamily={theme.fonts.body}>
      <Navbar />
      <Box display="flex" justifyContent="center" pt="5%" bg="gray.100">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width={containerWidth}
          px="5%"
          py="5%"
        >
          <VStack spacing={12} align="center" width="100%">
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              textAlign="center"
              mb={4}
              color="black"
            >
              Empathic Voice Interface (EVI)
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              lineHeight="1.8"
              textAlign="center"
              maxW="900px"
            >
              The Empathic Voice Interface (EVI) is a groundbreaking technology
              that allows for emotionally intelligent voice interactions. EVI
              utilizes advanced AI algorithms to understand and respond to the
              emotional state of users, making conversations more natural and
              empathetic.
            </Text>
          </VStack>
          <Image
            src={eviImage}
            alt="Empathic Voice Interface"
            borderRadius="lg"
            boxShadow="lg"
            mt={8}
            width="full"
            maxW="1200px"
            objectFit="cover"
          />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mt={12}>
            <VStack
              bg="white"
              borderRadius="md"
              p={6}
              spacing={6}
              align="start"
              boxShadow="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Heading as="h3" fontSize="2xl" fontWeight="semibold" mt={4}>
                How EVI Works
              </Heading>
              <Text fontSize="md" lineHeight="1.6">
                EVI leverages sophisticated voice recognition and emotional
                analysis technologies. It captures vocal tones, pitch, and rhythm
                to assess the user's emotional state. This information is then
                used to tailor responses that are both contextually and
                emotionally appropriate, ensuring a more engaging and supportive
                interaction.
              </Text>
              <Button
                as="a"
                href="https://dev.hume.ai/docs/empathic-voice-interface-evi/overview"
                colorScheme="blue"
                borderRadius="md"
                variant="solid"
                size="lg"
                boxShadow="md"
              >
                Learn More
              </Button>
            </VStack>
            <VStack
              bg="white"
              borderRadius="md"
              p={6}
              spacing={6}
              align="start"
              boxShadow="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Heading as="h3" fontSize="2xl" fontWeight="semibold" mt={4}>
                Benefits of EVI
              </Heading>
              <Text fontSize="md" lineHeight="1.6">
                EVI enhances user experience by providing personalized responses
                based on emotional context. This leads to improved user
                satisfaction and more effective communication, especially in
                sensitive or high-stress situations.
              </Text>
              <Button
                as="a"
                href="https://dev.hume.ai/docs/empathic-voice-interface-evi/overview"
                colorScheme="blue"
                borderRadius="md"
                variant="solid"
                size="lg"
                boxShadow="md"
              >
                Explore EVI
              </Button>
            </VStack>
          </SimpleGrid>
        </Box>
      </Box>
      <Box maxW="1280px" mx="auto" px="5%" mt="10%" pb="4%">
        <Divider borderColor="gray.300" />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mt={8}>
          {[
            {
              title: "Measure Expression",
              description:
                "Use psychologically valid models of facial movement and vocal modulation.",
              bgColor: "#f0daf5",
              link: "/measure-expression",
            },
            {
              title: "Interpret Expressive Communication",
              description:
                "Analyze expressive communication to better understand and respond to users.",
              bgColor: "#d4e1f1",
              link: "/interpret-communication",
            },
          ].map((item, index) => (
            <VStack
              key={index}
              bg={item.bgColor}
              borderRadius="md"
              p={5}
              spacing={4}
              align="start"
              boxShadow="md"
            >
              <Heading as="h3" fontSize="xl" fontWeight="semibold" mt={4}>
                {item.title}
              </Heading>
              <Text fontSize="md" lineHeight="1.6">{item.description}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
