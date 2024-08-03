import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Card from "./ResearchComponents/Card";
import LineGraph from "./ResearchComponents/graphs/LineGraph";
import BloodPressureChart from "./ResearchComponents/graphs/BloodPressureChart";
import ActivityChart from "./ResearchComponents/graphs/ActivityChart";
const Research = () => {
  return (
    <Grid
      templateAreas={{
        base: `"header" "main" "footer"`,
        md: `"sample bloodpressure activity" 
             "physicalHealth range biomarkersDetails" 
             "physicalHealth range chat"`,
      }}
      gridTemplateRows={{ base: "auto", md: "1fr 1fr 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
      gap={4}
      p={4}
      height="100vh"
    >
      <GridItem area="sample">
        <Card title="Sample Line Chart" graph={<LineGraph />} />
      </GridItem>
      <GridItem area="bloodpressure">
        <Card title="Blood Pressure" graph={<BloodPressureChart />} />
      </GridItem>
      <GridItem area="activity">
        <Card title="Activity" graph={<ActivityChart />} />
      </GridItem>
    </Grid>
  );
};

export default Research;
