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
	AbsoluteCenter,
} from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService.jsx";
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
import ProgressChart from "./ProgressChart.jsx";

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
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return `${date.getMonth() + 1}/${date.getDate()}`;
	};

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
					fitnessData?.data?.data?.sleep.map(
						(obj) => obj.totalSleepMinutes / 60
					) || [],
			},
		],
		heart: [
			{
				name: "Heart Rate",
				data: fitnessData?.data?.data?.bpm.map((obj) => obj.bpm) || [],
			},
		],
	};
	const labels = {
		steps: fitnessData?.data?.data?.steps.map((obj) => formatDate(obj.date)),
		sleep: fitnessData?.data?.data?.sleep.map((obj) => formatDate(obj.date)),
		heart: fitnessData?.data?.data?.bpm.map((obj) => formatDate(obj.time)),
	};
	// console.log(fitnessData);
	// console.log(labels);

	return (
		<Box>
			<SimpleGrid columns={3} spacing={4} mb={4}>
				<ProgressChart
					data={scoreData.fitnessScore}
					color="#74d68e"
					label="Overall Fitness"
				/>
				<ProgressChart
					data={scoreData.sleep}
					color="#74d6d1"
					label="Sleep Quality"
				/>
				<ProgressChart
					data={scoreData.steps}
					color="#f57064"
					label="Walking Activity"
				/>
			</SimpleGrid>
			<Box position="relative" pt={10}>
				<Divider />
				<AbsoluteCenter bg="white" px="4">
					<Text as="b" fontSize="3xl">
						Recent Activity
					</Text>
				</AbsoluteCenter>
			</Box>

			<VStack spacing={8} align="stretch">
				<Box>
					<Heading size="md" mb={4}>
						Steps per Day
					</Heading>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={data.steps}
							xAxisLabels={labels.steps}
							yAxisTitle="Daily Steps"
							barColor="#74d68e"
						/>
					</ResponsiveContainer>
				</Box>

				<Box>
					<Heading size="md" mb={4}>
						Sleep (in hours)
					</Heading>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={data.sleep}
							xAxisLabels={labels.sleep}
							yAxisTitle="Sleep Hours"
							barColor="#74d6d1"
						/>
					</ResponsiveContainer>
				</Box>

				<Box>
					<Heading size="md" mb={4}>
						Heart Rate (BPM)
					</Heading>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={data.heart}
							xAxisLabels={labels.heart}
							yAxisTitle="BPM"
							barColor="#f57064"
						/>
					</ResponsiveContainer>
				</Box>
			</VStack>
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
	const tabListBorderColor = useColorModeValue("gray.200", "gray.600");
	const tabListBgColor = useColorModeValue("white", "gray.800");

	const { user } = useAuth();

	useEffect(() => {
		const gradient = new Gradient();
		gradient.initGradient("#gradient-canvas");
	}, [isLoading]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (user) {
					const idToken = await user.getIdToken();
					const [healthResponse, fitResponse, scoreResponse] =
						await Promise.all([
							fetch("https://trymeddy.com/api/medical-record/", {
								headers: {
									idtoken: idToken,
									"Content-Type": "application/json",
								},
							}),
							fetch("https://trymeddy.com/api/gfit", {
								headers: {
									idtoken: idToken,
									"Content-Type": "application/json",
								},
							}),
							fetch("https://trymeddy.com/api/gfit/report", {
								headers: {
									idtoken: idToken,
									"Content-Type": "application/json",
								},
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
					setError(null);
				} else {
					throw new Error("No user is signed in");
				}
			} catch (err) {
				console.error(err.message);
				setHealthData(null);
				setFitnessData(null);
				setScoreData(null);
				setIsLoading(false);
				setError(err.message);
			}
		};
		fetchData();
	}, [user]);

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
					borderColor={borderColor}
					borderTopRadius="md"
					bg={bgColor}
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
							borderColor={tabListBorderColor}
							bg={tabListBgColor}
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
