import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Card from "./ResearchComponents/Card";
import smiley from "./ResearchComponents/smiley.webp";
import greenhex from "./ResearchComponents/green_hex.png";
import gray from "./ResearchComponents/dark_gray_background.png";
import LineGraph from "./ResearchComponents/graphs/LineGraph";
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
        <Card title="Sample Line Chart" graph={<LineGraph />} />
      </GridItem>
    </Grid>
  );
};

export default Research;
