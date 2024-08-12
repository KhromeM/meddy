import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  useColorModeValue,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useMediaQuery,
} from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService.jsx";
import { ResponsiveContainer } from "recharts";
import Recommendations, { RecommendationsAction } from "./Recommendations";
import BarChart from "./BarChart.jsx";
import ProgressChart from "./ProgressChart.jsx";
import './HealthMediaQuery.css'

const cardBg = "#F5E9DB";

const HealthSystemTab = ({ category, isSelected }) => {
  const bgColor = isSelected ? "#058247" : cardBg;
  const textColor = isSelected ? "#FAF3EA" : "#0e3c26";
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Tab
      py={2}
      px={2}
      mx={1}
      borderRadius="20"
      bg={bgColor}
      color={textColor}
      fontWeight="bold"
      fontSize={isLargerThan768 ? "xl" : "md"}
      _selected={{
        bg: bgColor,
        color: textColor,
        borderBottom: "none",
      }}
      _hover={{ bg: isSelected ? bgColor : "#E5D9CB" }}
      transition="all 0.2s"
      flex={1}
      maxWidth="200px"
    >
      {category.name.split(" ")[0]}
    </Tab>
  );
};

const FitnessContent = ({ fitnessData, scoreData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const chartData = {
    steps: [{ name: "Steps", data: fitnessData?.data?.data?.steps.map((obj) => obj.steps) || [] }],
    sleep: [{ name: "Sleep", data: fitnessData?.data?.data?.sleep.map((obj) => obj.totalSleepMinutes / 60) || [] }],
    heart: [{ name: "Heart Rate", data: fitnessData?.data?.data?.bpm.map((obj) => obj.bpm) || [] }],
  };

  const chartLabels = {
    steps: fitnessData?.data?.data?.steps.map((obj) => formatDate(obj.date)),
    sleep: fitnessData?.data?.data?.sleep.map((obj) => formatDate(obj.date)),
    heart: fitnessData?.data?.data?.bpm.map((obj) => formatDate(obj.time)),
  };

  const renderCharts = () => (
    <VStack spacing={8} align="stretch">
      {[
        { title: "Steps per Day", data: chartData.steps, labels: chartLabels.steps, yAxisTitle: "Daily Steps", color: "#058247" },
        { title: "Sleep (in hours)", data: chartData.sleep, labels: chartLabels.sleep, yAxisTitle: "Sleep Hours", color: "#299563" },
        { title: "Heart Rate (BPM)", data: chartData.heart, labels: chartLabels.heart, yAxisTitle: "BPM", color: "#0e3c26" },
      ].map(({ title, data, labels, yAxisTitle, color }) => (
        <Box key={title} bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
          <Heading color="#0e3c26" size="md" mb={4}>{title}</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              xAxisLabels={labels}
              yAxisTitle={yAxisTitle}
              barColor={color}
            />
          </ResponsiveContainer>
        </Box>
      ))}
    </VStack>
  );

  return (
    <Box>
      <SimpleGrid columns={{ sm: 1, md: 3, xl: 3 }} spacing="24px" mb={6}>
        <ProgressChart data={scoreData.fitnessScore} color="#058247" label="Overall Fitness" pb="40px" bg={cardBg} />
        <ProgressChart data={scoreData.sleep} color="#299563" label="Sleep Quality" pb="40px" bg={cardBg} />
        <ProgressChart data={scoreData.steps} color="#0e3c26" label="Walking Activity" pb="40px" bg={cardBg} />
      </SimpleGrid>
      <Text as="b" fontSize="5xl" mb={6} color="#0e3c26">
        Recent Activity
      </Text>
      {renderCharts()}
    </Box>
  );
};

const HealthSystemContent = ({ category }) => {
  const textColor = "#0e3c26";

  return (
    <Box>
      <SimpleGrid
        gridTemplateRows={{ sm: "1fr", md: "1fr", xl: "auto" }}
        gridAutoRows='1fr'
        alignItems='stretch'
        mb={5}
        columns={{ sm: 1, md: 2, xl: 2 }}
        spacing="24px"
      >
        <Box className='leftWidgetHealth' maxHeight={{lg: '600px', xl: '500px'}}  display="flex" flexDirection="column" flex="1">
          <ProgressChart
            data={category.score}
            title={category.name}
            label={category.oneLineSummary}
            color="#058247"
            height="100%"
            bg={cardBg}
            textColor={textColor}
            textColorOfSubtext={textColor}
            healthPageNonFitness={true}
          />
        </Box>
        <Box className="rightWidgetHealth" maxHeight={{lg: '600px', xl: '500px'}}  display="flex" flexDirection="column" flex="1" bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
          <VStack  flex="1" align="start" spacing={4}>
            <Recommendations medData={category} />
          </VStack>
        </Box>
      </SimpleGrid>
      <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
        <RecommendationsAction medData={category} />
      </Box>
    </Box>
  );
};

const HealthPanel = () => {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fitnessData, setFitnessData] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const bgColor = "#FAF3EA";
  const textColor = "#0e3c26";

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("No user is signed in");
        setIsLoading(false);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const [healthData, fitData, scoreData] = await Promise.all([
          fetch("https://trymeddy.com/api/medical-record/", { headers: { idtoken: idToken, "Content-Type": "application/json" } }).then(res => res.json()),
          fetch("https://trymeddy.com/api/gfit", { headers: { idtoken: idToken, "Content-Type": "application/json" } }).then(res => res.json()),
          fetch("https://trymeddy.com/api/gfit/report", { headers: { idtoken: idToken, "Content-Type": "application/json" } }).then(res => res.json()),
        ]);

        const fitnessScore = Math.round((scoreData.sleep + scoreData.steps) / 2);
        scoreData.fitnessScore = fitnessScore;

        setHealthData(healthData);
        setFitnessData(fitData);
        setScoreData(scoreData);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error(err.message);
        setError("Failed to fetch data!");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100%" bg={bgColor}>
        <Spinner size="xl" color="#058247" />
      </Box>
    );
  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100%" bg={bgColor}>
        <Text color={textColor}>Error: {error}</Text>
      </Box>
    );

  const healthCategories = [
    { name: "Fitness", component: <FitnessContent fitnessData={fitnessData} scoreData={scoreData} /> },
    { name: "Heart", component: <HealthSystemContent category={healthData.heartHealth} /> },
    { name: "Gut", component: <HealthSystemContent category={healthData.gutHealth} /> },
    { name: "Brain", component: <HealthSystemContent category={healthData.brainHealth} /> },
    { name: "Immune", component: <HealthSystemContent category={healthData.immuneSystem} /> },
    { name: "Bone", component: <HealthSystemContent category={healthData.musculoskeletalHealth} /> },
    { name: "Hormonal", component: <HealthSystemContent category={healthData.hormonalProfile} /> },
  ];

  return (
    <Box position="relative" minHeight="100vh" width="100%" overflow="auto" borderRadius={10} padding="35px" bg={bgColor}>
      <VStack spacing={0} align="stretch" height="100%" width="100%">
        <Box py={4} px={4} width="100%">
          <Heading size="2xl" textAlign="left" color={textColor} opacity={100} height={55} pl={5}>
            Your Health Summary
          </Heading>
        </Box>
        <Box display="flex" flexDirection="column" flex={1} borderTopRadius="none" width="100%" overflow="hidden">
          <Tabs index={selectedIndex} onChange={setSelectedIndex} variant="unstyled" height="100%" display="flex" flexDirection="column">
            <TabList position="sticky" top={0} zIndex={1} bg={bgColor}>
              <HStack spacing={0} overflowX="auto" py={2} px={4} width="100%">
                {healthCategories.map((category, index) => (
                  <HealthSystemTab
                    key={category.name}
                    category={category}
                    isSelected={index === selectedIndex}
                  />
                ))}
              </HStack>
            </TabList>
            <TabPanels flex={1}>
              {healthCategories.map((category) => (
                <TabPanel key={category.name} p={6}>
                  {category.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Box>
  );
};

export default HealthPanel;