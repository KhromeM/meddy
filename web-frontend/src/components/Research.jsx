import React from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";

const Research = () => {
  return (
    <Grid
      templateAreas={{
        base: `"header" "main" "footer"`,
        md: `"biomarkers biomarkers biologicalAge" 
             "physicalHealth range biomarkersDetails" 
             "physicalHealth range chat"`,
      }}
      gridTemplateRows={{ base: "auto", md: "repeat(3, 1fr)" }}
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
      gap={4}
      p={4}
      height="100vh"
    >
      <GridItem area="biomarkers" bg="gray.700" p={4} borderRadius="lg">
        <Box h="100%">345 biomarkers tested</Box>
      </GridItem>
      <GridItem area="biologicalAge" bg="orange.400" p={4} borderRadius="lg">
        <Box h="100%">Biological Age</Box>
      </GridItem>
      <GridItem area="physicalHealth" bg="white" p={4} borderRadius="lg">
        <Box h="100%">Physical Health</Box>
      </GridItem>
      <GridItem area="range" bg="black" p={4} borderRadius="lg">
        <Box h="100%">12 out of range</Box>
      </GridItem>
      <GridItem area="biomarkersDetails" bg="black" p={4} borderRadius="lg">
        <Box h="100%">Biomarkers Details</Box>
      </GridItem>
      <GridItem area="chat" bg="gray.200" p={4} borderRadius="lg">
        <Box h="100%">Chat</Box>
      </GridItem>
    </Grid>
  );
};

export default Research;
