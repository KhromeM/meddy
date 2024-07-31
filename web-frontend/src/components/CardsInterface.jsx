import React from "react";
import {
  Box,
  Button,
  Image,
  Flex,
  Text,
  Heading,
  Stack,
  Container
} from "@chakra-ui/react";

const EmpathicVoiceInterface = ({
  headingText,
  img,
  paragraphText,
  btnText,
  bgColor,
}) => {
  return (
    <Container maxW="container.xl" px={4}>
    <Box
      bg={bgColor}
      borderRadius="md"
      boxShadow="md"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mt={4}
      px={4}
      py={8}
      w={"100%"}
      boxSizing="border-box"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-around"
        flexWrap={'wrap'}
        w="100%"
      >
        <Stack spacing={4} pt={10} pb={10} pl={10} pr={10} flex="1">
          <Heading as="h2" size="lg">
            {headingText}
          </Heading>
          <Text fontSize="md" maxW="md"  lineHeight="1.5" flexWrap={'wrap'}>
            {paragraphText}
          </Text>
          <Flex flexWrap={'wrap'}  gap={4} >
            <Button
              colorScheme="blackAlpha"
              mt={'5px'}
               className="download-button"
               width={{ base: "100%", md: "auto" }}
                flex={{ base: "1 1 100%", md: "none" }}
              rightIcon={
                <Image
                  src="/assets/svg-1.svg"
                  boxSize="1.5rem"
                  alt="Web icon"
                  className="download-icon"
                />
              }
            >
              {btnText}
            </Button>
            <Button variant="outline"
            width={{ base: "100%", md: "auto" }}
            flex={{ base: "1 1 100%", md: "none" }}
            colorScheme="blackAlpha" mt={'5px'} >
              Documentation
            </Button>
          </Flex>
        </Stack>
        <Box w={{base:'250px',md:'350px',lg:'400px' }}  p={4} flexShrink={0}>
          <Image w={'inherit'} src={img} alt="Voice interface graph" borderRadius="md" />
        </Box>
      </Flex>
    </Box>
    </Container>

  );
};

export default EmpathicVoiceInterface;
