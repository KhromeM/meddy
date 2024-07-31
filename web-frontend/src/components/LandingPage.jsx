import React, { useEffect, useRef } from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService.jsx";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { Testimonial } from "./sections/Testimonial";
import { Blog } from "./sections/Blog";
import { Footer } from "./sections/Footer";
import * as THREE from 'three';
import { setupThreeJSScene } from "./sections/threejsBackground.js";

const ThreeJSBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const cleanup = setupThreeJSScene(mountRef);
    return cleanup;
  }, []);


  return (
    <Box ref={mountRef} position="fixed" top="0" left="0" w="100%" h="100%" zIndex="999" />
  );
};

export const LandingPage = () => {
  const { login } = useAuth();

  return (
    <Box position="relative" minH="100vh">
      <ThreeJSBackground />
      <Box position="relative" zIndex="1">
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

          <Footer />
        </VStack>
      </Box>
    </Box>
  );
};