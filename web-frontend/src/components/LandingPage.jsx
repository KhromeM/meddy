import React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService.jsx";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { Testimonial } from "./sections/Testimonial";
import Blog from "./sections/Blog";
import { Footer } from "./sections/Footer";
import { Endorsements } from "./endorsements.jsx";

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
          <Blog />
        </Container>

        <Container maxW="container.xl" px={4}>
          <Endorsements />
        </Container>

        <Footer />
      </VStack>
    </Box>
  );
};
