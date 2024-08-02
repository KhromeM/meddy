import React, { useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
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
      position="absolute"
      top="0"
      left="0"
      w="100%"
      h="100%"
      zIndex="-1"
      pointerEvents="none"
    />
  );
};

const placeholderImage = "https://via.placeholder.com/150";

const teamMembers = [
  { name: "Alice Johnson", role: "Lead Developer", bio: "Alice leads the development team with her extensive experience in software engineering." },
  { name: "Bob Smith", role: "Product Manager", bio: "Bob oversees product development and ensures our goals align with user needs." },
  { name: "Charlie Davis", role: "UI/UX Designer", bio: "Charlie designs intuitive user interfaces and experiences." },
  { name: "Dana Lee", role: "Backend Developer", bio: "Dana focuses on server-side development and database management." },
  { name: "Evan Wilson", role: "Frontend Developer", bio: "Evan brings the visual design to life through his frontend expertise." },
  { name: "Fiona Green", role: "QA Engineer", bio: "Fiona ensures the quality of our products through rigorous testing." },
  { name: "George Brown", role: "DevOps Engineer", bio: "George handles deployment processes and cloud infrastructure." },
  { name: "Hannah White", role: "Marketing Specialist", bio: "Hannah drives our marketing strategy and outreach." },
  { name: "Isaac Thomas", role: "Business Analyst", bio: "Isaac analyzes business requirements and translates them into actionable tasks." },
  { name: "Julia Martinez", role: "Content Writer", bio: "Julia creates engaging content for our users and stakeholders." },
  { name: "Kevin Adams", role: "Customer Support", bio: "Kevin provides exceptional support and resolves user issues." },
];

export const Team = () => {
  const containerWidth = useBreakpointValue({ base: "90%", md: "80%", lg: "70%" });

  return (
    <>
      <Box
        position="relative"
        minHeight="100vh"
        width="100vw"
        overflow="hidden"
        bg="transparent"
      >
        <ThreeJSBackground hexColor={0xffeae5} />
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          pt="5%"
          bg="gray.100"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width={containerWidth}
            px="5%"
            py="5%"
          >
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              textAlign="center"
              mb={8}
              color="black"
            >
              Meet the Team
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {teamMembers.map((member, index) => (
                <VStack
                  key={index}
                  bg="white"
                  borderRadius="md"
                  p={6}
                  spacing={4}
                  align="center"
                  boxShadow="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Image
                    src={placeholderImage}
                    alt={member.name}
                    borderRadius="full"
                    boxSize="150px"
                    objectFit="cover"
                  />
                  <Heading as="h3" fontSize="xl" fontWeight="semibold">
                    {member.name}
                  </Heading>
                  <Text fontSize="md" fontWeight="medium" color="gray.600">
                    {member.role}
                  </Text>
                  <Text fontSize="sm" textAlign="center" color="gray.500">
                    {member.bio}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </>
  );
};
