import React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService.jsx";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { Testimonial } from "./sections/Testimonial";
import Impact from "./sections/Impact.jsx";
import { Footer } from "./sections/Footer";
import { Endorsements } from "./Endorsements/endorsements.jsx";
import SpinningLogo from "./SpinningLogo.jsx";
export const LandingPage = () => {
  const { login } = useAuth();

  return (
    <Box w="full" overflowX="hidden">
      <VStack
        spacing={{ base: "4rem", md: "6rem", lg: "8rem" }}
        align="stretch"
      >
        <Hero login={login} />

        <Container maxW="container.xl" px={4}>
          <Features />
        </Container>

        <Testimonial />

        <Container maxW="container.xl" px={4}>
          <Impact />
        </Container>
       <Box height="1500px" backgroundColor="#fcf9e8" width="100%" paddingTop="200px">
            <SpinningLogo
              size={200}
              outerSpeed={10}
              innerSpeed={8}
              outerCircleSize={1.2}
              innerCircleSize={0.8}
              color="black"
            />
       </Box>

        <Container maxW="container.xl" px={4}>
          <Endorsements />
        </Container>

        <Footer />
      </VStack>
    </Box>
  );
};
