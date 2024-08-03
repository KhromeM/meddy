import React from "react";
import { useEffect, useRef } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  Image,
  HStack,
  Divider,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Footer } from "./sections/Footer";
import { Navbar } from "./sections/Navbar";
import { setupThreeJSScene } from "../components/sections/threejsBackground";

const ThreeJSBackground = ({ hexColor }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let cleanup;
    if (mountRef.current) {
      cleanup = setupThreeJSScene(mountRef, hexColor);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [hexColor]);

  return (
    <Box
      ref={mountRef}
      position="fixed"
      top="0"
      left="0"
      w="100%"
      h="100%"
      zIndex="-1"
      pointerEvents="none"
    />
  );
};

const teamMembers = [
  {
    name: "Za Mustafa",
    title: "Team Leader - (Web Developer)",
    linkedIn: "https://www.linkedin.com/in/khromem/",
    gitHub: "https://github.com/KhromeM",
    profilePic: "Za.jpeg",
  },
  {
    name: "William Chan",
    title: "Product Manager",
    linkedIn: "https://www.linkedin.com/in/william-chan-3bb674194/",
    profilePic: "William.jpeg",
  },
  {
    name: "Muzzammil Nawab",
    title: "Backend Developer",
    linkedIn: "www.linkedin.com/in/alinawb",
    gitHub: "https://github.com/YaBoiAli",
    profilePic: "Muzzammil.jpeg",
  },
  {
    name: "Nahi Khan",
    title: "Flutter Developer",
    linkedIn: "https://www.linkedin.com/in/nahi-khan/",
    gitHub: "https://github.com/nvhiii",
    profilePic: "nopfp.png",
  },
  {
    name: "Varvara Mironov",
    title: "Web Developer",
    linkedIn: "https://www.linkedin.com/in/varvara-mironov-55180426a/",
    gitHub: "https://github.com/VarSiv",
    profilePic: "nopfp.png",
  },
  {
    name: "Shashank datta Bezgam",
    title: "Web Developer",
    linkedIn: "https://www.linkedin.com/in/shashankdatta/",
    gitHub: "https://github.com/shashankdatta",
    profilePic: "shashank.jpeg",
  },
  {
    name: "Fourat Rachid",
    title: "Flutter Developer",
    linkedIn: "https://www.linkedin.com/in/fouratrachid/",
    gitHub: "https://github.com/fouratrachid",
    profilePic: "Fourat.jpeg",
  },
  {
    name: "Duy Doan",
    title: "Flutter Developer",
    linkedIn: "https://www.linkedin.com/in/duy-doan-5936672a4/",
    gitHub: "https://github.com/DuyD279",
    profilePic: "nopfp.png",
  },
  {
    name: "Brain Lin",
    title: "Flutter Developer",
    linkedIn: "https://www.linkedin.com/in/brian-lin2001/",
    gitHub: "https://github.com/blin4504",
    profilePic: "Brain.jpeg",
  },
  {
    name: "Aditya Udyavar",
    title: "Backend Developer",
    linkedIn: "https://www.linkedin.com/in/aditya-udyavar/",
    gitHub: "https://github.com/iamudyavar",
    profilePic: "Aditya.jpeg",
  },
  {
    name: "Kin Pong",
    title: "Flutter Developer",
    linkedIn: "https://www.linkedin.com/in/kin-pong-to-26535824b/",
    gitHub: "https://github.com/icez213",
    profilePic: "Kin.jpeg",
  },
  {
    name: "Osaf Ali",
    title: "Web Developer",
    linkedIn: "https://www.linkedin.com/in/osaf-ali/",
    gitHub: "#",
    profilePic: "Osaf.jpeg",
  },
  {
    name: "Sean Munjal",
    title: "Web Developer",
    linkedIn: "https://www.linkedin.com/in/seanmunjal/",
    gitHub: "https://github.com/TheForeverOptimist",
    profilePic: "Sean.jpeg",
  },
];

export const AboutUsPage = () => {
  useEffect(() => {}, []);
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  return (
    <Box w="full" overflowX="hidden">
      <VStack
        spacing={{ base: "4rem", md: "6rem", lg: "8rem" }}
        align="stretch"
      >
        <ThreeJSBackground hexColor={0xffeae5} />
        <Navbar />
        <Container maxW="container.xl" px={4}>
          <VStack spacing="4rem" align="stretch">
            {/* Title and Image */}
            <HStack
              spacing={8}
              align="flex-start"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Box flex="1">
                <Heading
                  as="h1"
                  size="2xl"
                  fontFamily="Inter, sans-serif"
                  fontWeight="bold"
                >
                  About Meddy
                </Heading>
                <Text
                  fontSize="lg"
                  fontFamily="Inter, sans-serif"
                  mt="1rem"
                  lineHeight="1.6"
                >
                  Meddy is a friendly medical assistant AI that is HIPPA
                  Compliant. Meddy is designed to bridge the communication gap
                  between patients and doctors.
                </Text>
              </Box>
              <Box flex="0.5">
                <Image
                  src="./assets/meddy.png"
                  alt="About Meddy illustration"
                />
              </Box>
            </HStack>

            {/* What We Built */}
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="15px"
              boxShadow="md"
              bg="#ffffff"
            >
              <Heading
                as="h2"
                size="xl"
                mb="1rem"
                fontFamily="Inter, sans-serif"
                fontWeight="bold"
                textAlign="center"
              >
                Meddy is designed for:
              </Heading>
              <Text
                fontSize="lg"
                fontFamily="Inter, sans-serif"
                textAlign="center"
                lineHeight="1.6"
              ></Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt="1rem">
                <Box>
                  <Text
                    fontSize="lg"
                    fontFamily="Inter, sans-serif"
                    lineHeight="1.6"
                  >
                    • Elderly patients <br />
                    • Non-English speakers <br />
                    • Patients who are less technologically savvy
                    <br />• Patients without someone to discuss their medical
                    issues with (WIP) <br />
                    • Infrequent/limited access to doctors
                    <br />
                    • Getting answers for medical questions <br />
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="lg"
                    fontFamily="Inter, sans-serif"
                    lineHeight="1.6"
                  >
                    • Difficulty understanding medical jargon or English <br />
                    • Trouble following treatment instructions <br />•
                    Remembering the correct dosage and time for medication{" "}
                    <br />
                    • Hesitation in disclosing personal matters due to weak
                    doctor-patient relationships <br />
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Our Values */}
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="15px"
              boxShadow="md"
              bg="#ffffff"
            >
              <Heading
                as="h2"
                size="xl"
                mb="1rem"
                fontFamily="Inter, sans-serif"
                fontWeight="bold"
                textAlign="center"
              >
                Our Values
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                {[
                  {
                    title: "Friendly Medical Assistance",
                    description:
                      "Meddy: Your Friendly Medical Assistant AI, always here to help with a smile.",
                  },
                  {
                    title: "HIPAA Compliance",
                    description:
                      "Your privacy is our priority. Meddy adheres to all HIPAA regulations to ensure your data is secure.",
                  },
                  {
                    title: "User-Friendly Interface",
                    description:
                      "Extremely easy to use, especially for our target demographic. Everything can be done via voice controls.",
                  },
                  {
                    title: "Medical Q&A",
                    description:
                      "Powered by Large Language Models (LLMs) trained on medical data, Meddy can answer your medical questions accurately.",
                  },
                  {
                    title: "Real-Time Translation",
                    description:
                      "Facilitates communication between non-English speaking patients and doctors with speech-to-speech translation.",
                  },
                  {
                    title: "Appointment Summaries",
                    description:
                      "Remembers and summarizes appointment details, ensuring you recall important information.",
                  },
                  {
                    title: "Treatment Plan Reminders",
                    description:
                      "Helps you stay on track with your treatment plans and medication schedules.",
                  },
                  {
                    title: "Emotional Support",
                    description:
                      "Acts as a friendly companion, addressing the emotional aspects of medical issues. Because emotional well-being is crucial to overall health.",
                  },
                ].map((value, index) => (
                  <GridItem key={index}>
                    <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="15px"
                      boxShadow="sm"
                      bg="#ffffff"
                    >
                      <Heading
                        as="h4"
                        size="md"
                        mb="0.5rem"
                        fontFamily="Inter, sans-serif"
                        fontWeight="bold"
                      >
                        {value.title}
                      </Heading>
                      <Text
                        fontSize="lg"
                        fontFamily="Inter, sans-serif"
                        lineHeight={"1.6"}
                      >
                        {value.description}
                      </Text>
                    </Box>
                  </GridItem>
                ))}
              </SimpleGrid>
            </Box>

            {/* Our Team */}
            <Box>
              <Heading
                as="h2"
                size="xl"
                mb="1rem"
                fontFamily="Inter, sans-serif"
                fontWeight="bold"
                textAlign="center"
              >
                Our Team
              </Heading>
              <Text
                fontSize="lg"
                textAlign="center"
                mb="2rem"
                fontFamily="Inter, sans-serif"
              >
                Our dedicated team is at the heart of everything we do.
              </Text>
              <SimpleGrid columns={columns} spacing={10}>
                {teamMembers.map((member, index) => (
                  <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="15px"
                    overflow="hidden"
                    p={5}
                    textAlign="center"
                    bg="#ffffff"
                    boxShadow="md"
                  >
                    <Image
                      src={`./assets/teams/${member.profilePic}`}
                      alt={member.name}
                      mx="auto"
                      mb={4}
                      borderRadius="full"
                      h="150px"
                      w="150px"
                    />
                    <Heading
                      as="h3"
                      size="md"
                      fontFamily="Inter, sans-serif"
                      fontWeight="bold"
                    >
                      {member.name}
                    </Heading>
                    <Text
                      fontSize="sm"
                      fontFamily="Inter, sans-serif"
                      color="gray.500"
                      lineHeight={"1.9"}
                    >
                      {member.title}
                    </Text>
                    <Divider my={2} />
                    <HStack justify="center" spacing={4}>
                      <Button
                        as="a"
                        href={member.linkedIn}
                        size="sm"
                        colorScheme="linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </Button>
                      {member.gitHub && (
                        <Button
                          as="a"
                          href={member.gitHub}
                          size="sm"
                          colorScheme="gray"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </Button>
                      )}
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>

        <Footer />
      </VStack>
    </Box>
  );
};
