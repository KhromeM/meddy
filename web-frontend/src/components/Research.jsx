import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Card from "./ResearchComponents/Card";
import smiley from "./ResearchComponents/smiley.webp";
import greenhex from "./ResearchComponents/green_hex.png";
import gray from "./ResearchComponents/dark_gray_background.png";
const Research = () => {
  return (
    <Grid
      templateAreas={{
        base: `"header" "main" "footer"`,
        md: `"biomarkers biomarkers biologicalAge" 
             "physicalHealth range biomarkersDetails" 
             "physicalHealth range chat"`,
      }}
      gridTemplateRows={{ base: "auto", md: "1fr 1fr 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
      gap={4}
      p={4}
      height="100vh"
    >
      <GridItem area="biomarkers">
        <Card title="Biomarkers" bgImage={gray}></Card>
      </GridItem>
      <GridItem area="biologicalAge">
        <Card bg="orange.400" title="Biological Age" bgImage={greenhex}></Card>
      </GridItem>
      <GridItem area="physicalHealth">
        <Card bg="red" title="Physical Health"></Card>
      </GridItem>
      <GridItem area="range">
        <Card bg="black" title="Out of Range"></Card>
      </GridItem>
      <GridItem area="biomarkersDetails">
        <Card bg="black" title="Biomarkers Details"></Card>
      </GridItem>
      <GridItem area="chat">
        <Card bg="gray.200" title="Chat"></Card>
      </GridItem>
    </Grid>
  );
};

export default Research;
