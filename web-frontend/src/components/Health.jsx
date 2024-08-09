import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	VStack,
	Heading,
	Text,
	CircularProgress,
	Spinner,
	useColorModeValue,
	CircularProgressLabel,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	SimpleGrid,
	Divider,
} from "@chakra-ui/react";
import { Gradient } from "./Gradient";
import "../styles/gradient.css";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import Recommendations from "./Recommendations";
import BarChart from "./BarChart.jsx";

const HealthSystemTab = ({ category, isSelected }) => {
	const bgColor = useColorModeValue(
		isSelected ? "white" : "gray.100",
		isSelected ? "gray.700" : "gray.600"
	);
	const borderColor = useColorModeValue(
		isSelected ? "#FACC87" : "transparent",
		isSelected ? "#FACC87" : "transparent"
	);
	const textColor = useColorModeValue("gray.800", "white");

	return (
		<Tab
			py={2}
			px={4}
			borderTopRadius="md"
			bg={bgColor}
			color={textColor}
			fontWeight="medium"
			fontSize="sm"
			_selected={{
				bg: bgColor,
				color: textColor,
				borderTop: "2px solid",
				borderColor: borderColor,
				borderBottom: "none",
			}}
			_hover={{ bg: isSelected ? bgColor : "gray.200" }}
			transition="all 0.2s"
			mr={1}
		>
			{category.name.split(" ")[0]}
		</Tab>
	);
};

const FitnessContent = ({ fitnessData, scoreData }) => {
	const data = {
		steps: [
			{
				name: "Steps",
				data: fitnessData?.data?.data?.steps.map((obj) => obj.steps) || [],
			},
		],
		sleep: [
			{
				name: "Sleep",
				data:
					fitnessData?.data?.data?.sleep.map((obj) => obj.totalSleepMinutes) ||
					[],
			},
		],
		heart: [
			{
				name: "Heart Rate",
				data: fitnessData?.data?.data?.bpm.map((obj) => obj.bpm) || [],
			},
		],
	};
	console.log(fitnessData);
	console.log(data);

	return (
		<Box>
			<HStack spacing={6} mb={6}>
				<CircularProgress
					value={scoreData.fitnessScore}
					size="120px"
					thickness="12px"
					color={scoreData.fitnessScore > 60 ? "green.400" : "red.400"}
				>
					<CircularProgressLabel fontWeight="bold" fontSize="2xl">
						{scoreData.fitnessScore}%
					</CircularProgressLabel>
				</CircularProgress>
				<VStack align="start" spacing={2}>
					<Heading size="lg">Fitness</Heading>
					<Text fontSize="md">
						Your overall fitness based on activity and sleep patterns
					</Text>
				</VStack>
			</HStack>
			<Divider mb={6} />
			<SimpleGrid columns={2} spacing={4} mb={8}>
				<Box borderWidth={1} borderRadius="md" p={4}>
					<Text fontWeight="bold">Sleep Score</Text>
					<Text fontSize="2xl">{scoreData.sleep}%</Text>
				</Box>
				<Box borderWidth={1} borderRadius="md" p={4}>
					<Text fontWeight="bold">Steps Score</Text>
					<Text fontSize="2xl">{scoreData.steps}%</Text>
				</Box>
			</SimpleGrid>
			<Tabs>
				<TabList>
					<Tab>Steps</Tab>
					<Tab>Sleep</Tab>
					<Tab>Heart Rate</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Box width="100%">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.steps} />
							</ResponsiveContainer>
						</Box>
					</TabPanel>
					<TabPanel>
						<Box width="100%">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.sleep} />
							</ResponsiveContainer>
						</Box>
					</TabPanel>
					<TabPanel>
						<Box width="100%">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.heart} />
							</ResponsiveContainer>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

const HealthSystemContent = ({ category }) => {
	const getColorScheme = (score) => {
		if (score > 80) return "green";
		if (score > 60) return "yellow";
		return "red";
	};

	return (
		<Box>
			<HStack spacing={6} mb={6}>
				<CircularProgress
					value={category.score}
					size="120px"
					thickness="12px"
					color={getColorScheme(category.score)}
				>
					<CircularProgressLabel fontWeight="bold" fontSize="2xl">
						{category.score}%
					</CircularProgressLabel>
				</CircularProgress>
				<VStack align="start" spacing={2}>
					<Heading size="lg">{category.name}</Heading>
					<Text fontSize="md">{category.oneLineSummary}</Text>
				</VStack>
			</HStack>
			<Divider mb={6} />
			<VStack align="start" spacing={4}>
				<Recommendations medData={category} />
			</VStack>
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

	const borderColor = useColorModeValue("gray.200", "gray.600");
	const bgColor = useColorModeValue("white", "gray.800");

	useEffect(() => {
		const gradient = new Gradient();
		gradient.initGradient("#gradient-canvas");
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [healthResponse, fitResponse, scoreResponse] = await Promise.all([
					fetch("https://trymeddy.com/api/medical-record/", {
						headers: { idtoken: "dev", "Content-Type": "application/json" },
					}),
					fetch("https://trymeddy.com/api/gfit", {
						headers: { idtoken: "dev", "Content-Type": "application/json" },
					}),
					fetch("https://trymeddy.com/api/gfit/report", {
						headers: { idtoken: "dev", "Content-Type": "application/json" },
					}),
				]);

				if (!healthResponse.ok || !fitResponse.ok || !scoreResponse.ok) {
					throw new Error("Failed to fetch data!");
				}

				const [healthData, fitData, scoreData] = await Promise.all([
					healthResponse.json(),
					fitResponse.json(),
					scoreResponse.json(),
				]);

				const fitnessScore = Math.round(
					(scoreData.sleep + scoreData.steps) / 2
				);
				scoreData.fitnessScore = fitnessScore;

				setHealthData(healthData);
				setFitnessData(fitData);
				setScoreData(scoreData);
				setIsLoading(false);
			} catch (err) {
				console.error(err.message);
				setError(err.message);
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	if (isLoading)
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
				width="100%"
			>
				<Spinner size="xl" />
			</Box>
		);
	if (error)
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
				width="100%"
			>
				<Text>Error: {error}</Text>
			</Box>
		);

	const healthCategories = [
		{
			name: "Fitness",
			component: (
				<FitnessContent fitnessData={fitnessData} scoreData={scoreData} />
			),
		},
		{
			name: "Heart",
			component: <HealthSystemContent category={healthData.heartHealth} />,
		},
		{
			name: "Gut",
			component: <HealthSystemContent category={healthData.gutHealth} />,
		},
		{
			name: "Brain",
			component: <HealthSystemContent category={healthData.brainHealth} />,
		},
		{
			name: "Immune",
			component: <HealthSystemContent category={healthData.immuneSystem} />,
		},
		{
			name: "Musculoskeletal",
			component: (
				<HealthSystemContent category={healthData.musculoskeletalHealth} />
			),
		},
		{
			name: "Hormonal",
			component: <HealthSystemContent category={healthData.hormonalProfile} />,
		},
	];

	return (
		<Box position="relative" minHeight="100vh" width="100%" overflow="auto">
			<canvas
				id="gradient-canvas"
				data-js-darken-top
				data-transition-in
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
					zIndex: -1,
				}}
			></canvas>
			<VStack spacing={0} align="stretch" height="100%" width="100%">
				<Box py={4} px={4} width="100%">
					<Heading size="xl" textAlign="left" color="white">
						Your Health Summary
					</Heading>
				</Box>
				<Box
					display="flex"
					flexDirection="column"
					flex={1}
					borderTopWidth={1}
					borderColor={useColorModeValue("gray.200", "gray.600")}
					borderTopRadius="md"
					bg={useColorModeValue("white", "gray.800")}
					width="100%"
					overflow="hidden"
				>
					<Tabs
						index={selectedIndex}
						onChange={setSelectedIndex}
						variant="unstyled"
						height="100%"
						display="flex"
						flexDirection="column"
					>
						<TabList
							position="sticky"
							top={0}
							borderBottomWidth={1}
							borderColor={useColorModeValue("gray.200", "gray.600")}
							bg={useColorModeValue("white", "gray.800")}
							zIndex={1}
						>
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
							{healthCategories.map((category, index) => (
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
