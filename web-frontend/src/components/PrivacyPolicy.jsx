import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Link,
  Button,
  Image,
  Card,
  Divider,
} from "@chakra-ui/react";

import { useEffect } from "react";
import { Gradient } from "./Gradient"; // Import the Gradient class
import "../styles/gradient.css"; // Import the gradient CSS

const PrivacyPolicy = () => {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);
  return (
    <Box
      position="relative"
      minHeight="100vh"
      w="full"
      overflow="hidden"
      bg="transparent"
      display="flex"
      alignItems="center"
      rowGap={8}
      flexDirection="column"
      py={12}
    >
      <canvas
        id="gradient-canvas"
        data-js-darken-top
        data-transition-in
      ></canvas>
      <Container maxW="container.lg">
        <VStack spacing={5} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center">
            Privacy Policy
          </Heading>

          <Text color="gray.600">
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <Section title="Introduction">
            <Text>
              Welcome to Meddy ("we," "our," or "us"). This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our Meddy application and related
              services (collectively, the "Service").
            </Text>
          </Section>

          <Section title="Information We Collect">
            <Text>
              We collect information that you provide directly to us, including:
            </Text>
            <UnorderedList ml={5} mt={2}>
              <ListItem>
                Personal information (such as name, email address, and phone
                number)
              </ListItem>
              <ListItem>
                Health and fitness data from Google Fitness (with your explicit
                consent)
              </ListItem>
              <ListItem>Any other information you choose to provide</ListItem>
            </UnorderedList>
          </Section>

          <Section title="How We Use Your Information">
            <Text>We use the information we collect to:</Text>
            <UnorderedList ml={5} mt={2}>
              <ListItem>Provide, maintain, and improve our Service</ListItem>
              <ListItem>Personalize your experience</ListItem>
              <ListItem>Communicate with you about our Service</ListItem>
              <ListItem>Analyze usage of our Service</ListItem>
            </UnorderedList>
          </Section>

          <Section title="Google Fitness Integration">
            <Text>
              With your explicit permission, we integrate with Google Fitness to
              access your fitness and health data. This integration helps us
              provide personalized health insights and recommendations.
            </Text>
          </Section>

          <Section title="Data Storage and Retention">
            <Text>
              We store your data, including information obtained from Google
              Fitness, for a period of 30 days. After this period, your data is
              automatically deleted from our active systems.
            </Text>
          </Section>

          <Section title="Data Deletion on Request">
            <Text>
              You may request the deletion of your data at any time by
              contacting us at{" "}
              <Link href="mailto:privacy@meddy.com" color="blue.500">
                privacy@meddy.com
              </Link>
              . Upon receiving your request, we will delete your data from our
              systems within a reasonable timeframe, typically within 30 days.
            </Text>
          </Section>

          <Section title="Contact Us">
            <Text>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <Link href="mailto:privacy@meddy.com" color="blue.500">
                privacy@meddy.com
              </Link>
              .
            </Text>
          </Section>

          <Text fontStyle="italic" mt={8}>
            By using our Service, you agree to the collection and use of
            information in accordance with this Privacy Policy.
          </Text>
        </VStack>
      </Container>
      <Button
        onClick={() => {
          window.history.back();
        }}
        className="back-button"
        leftIcon={
          <Image
            src="/assets/svg-9b.svg"
            boxSize="1.5rem"
            alt="Web icon"
            className="back-icon"
          />
        }
        variant="solid"
      >
        Take me back
      </Button>
    </Box>
  );
};

const Section = ({ title, children }) => (
  <Card style={{ padding: "15px", border: "3px solid", borderRadius: "10px" }}>
    <Heading as="h2" size="lg">
      {title}
    </Heading>
    <Divider mb={4} />
    <Box>{children}</Box>
  </Card>
);

export default PrivacyPolicy;
