// Chakra imports
import {
	Flex,
	Grid,
	Heading,
	Icon,
	Image,
	SimpleGrid,
	useColorModeValue,
	Avatar,
	Text,
} from "@chakra-ui/react";
// assets
import peopleImage from "../../../assets/img/people-image.png";
import heartImage from "../../../assets/img/c4.webp";
import sleepImage from "../../../assets/img/c6.webp";

import logoChakra from "../../../assets/svg/logo-white.svg";
import BarChart from "../../../components/Charts/BarChart";
import LineChart from "../../../components/Charts/LineChart";
// Custom icons
import {
	CartIcon,
	DocumentIcon,
	GlobeIcon,
	WalletIcon,
} from "../../../components/Icons/Icons";
import React from "react";
import { dashboardTableData, timelineData } from "../../../variables/general";
import ActiveUsers from "./components/ActiveUsers";
import BuiltByDevelopers from "./components/BuiltByDevelopers";
import MiniStatistics from "./components/MiniStatistics";
import OrdersOverview from "./components/OrdersOverview";
import Projects from "./components/Projects";
import SalesOverview from "./components/SalesOverview";
import WorkWithTheRockets from "./components/WorkWithTheRockets";
import RemindersCard from "./components/RemindersCard";
import QuickActionCard from "./components/QuickActionCard";
import { FaWallet } from "react-icons/fa";
import { useAuth } from "../../../firebase/AuthService";
import QuickActionList from "./components/QuickActionList";
import Card from "../../../components/Card/Card";
import MultiChartContainer from "./components/MultiChartContainer";

const barChartData = [
	{
		name: "Sales",
		data: [0, 10, 30, 70, 120, 200, 340, 600, 500],
	},
];

export default function Dashboard() {
	const iconBoxInside = useColorModeValue("white", "white");
	const titleText = useColorModeValue("black", "black");
	const { user } = useAuth();

	return (
		<Flex flexDirection="column" paddingTop="60px">
			<Flex alignItems="center" mb="26px">
				<Avatar
					size="xl"
					name={user?.displayName || "Guest"}
					bg="blue.500"
					color="white"
					mr="16px"
					src={user?.photoURL}
				/>
				<Flex flexDirection="column">
					<Heading color={titleText} as="h1" size="xl">
						{user ? `Hi, ${user?.displayName || "Guest"}!` : "Hi Guest!"}
					</Heading>
					<Text color="gray.500">Welcome back</Text>
				</Flex>
			</Flex>
			{/* <Grid
        templateColumns={{ sm: "1fr", lg: "1.3fr 1.7fr" }}
        templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
        gap="24px"
        mb={{ lg: "26px" }}
      > */}
			<Grid
				// mt="26px"
				templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 2.5fr" }}
				templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
				gap="24px"
			>
				{/* <Projects
          title={"Projects"}
          amount={30}
          captions={["Companies", "Members", "Budget", "Completion"]}
          data={dashboardTableData}
        /> */}
				<Card backgroundColor={"#FAF3EA"} pt="16px" maxW="380">
					<QuickActionList iconBoxInside={iconBoxInside} />
				</Card>
				<MultiChartContainer
					title={"Biomarker Stats"}
					percentage={5}
					chart={<LineChart />}
				/>
			</Grid>
			<SimpleGrid mt="26px" columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
				{/* <ActiveUsers
          title={"Active Users"}
          percentage={23}
          chart={<BarChart chartData={barChartData} />}
        /> */}
				{/* <SalesOverview
          title={"Sales Overview"}
          percentage={5}
          chart={<LineChart />}
        /> */}
				{/* <MultiChartContainer
          title={"Biomarker Stats"}
          percentage={5}
          chart={<LineChart />}
        /> */}
				{/* ASK MEDDY THESE HEALTH PROMPTS */}
				<WorkWithTheRockets
					backgroundImage={heartImage}
					title={"I'm concerned about my heart rate."}
					description={
						"Meddy, how can I improve my heart health? I want to avoid the need to take medication."
					}
					backgroundImage2={sleepImage}
					title2={"I'm struggling with my sleep quality."}
					description2={
						"Meddy, how can I improve my sleep patterns? I often wake up feeling tired and unrested."
					}
				/>
				{/* </Grid> */}
				{/* <SimpleGrid columns={{ sm: 2, md: 2, xl: 3 }} mt="26px" spacing="24px"> */}
				<RemindersCard />

				{/* </SimpleGrid> */}
			</SimpleGrid>

			{/* <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} mt="26px" spacing="24px">
        <QuickActionCard
          icon={<Icon h={"24px"} w={"24px"} color="white" as={FaWallet} />}
          title={"Salary"}
          description={"Belong interactive"}
          // amount={2000}
        />
        <QuickActionCard
          icon={<Icon h={"24px"} w={"24px"} color="white" as={FaWallet} />}
          title={"Paypal"}
          description={"Freelance Payment"}
          amount={4550}
        />
      </SimpleGrid> */}
			{/* <Grid
        templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }}
        templateRows={{ md: "1fr auto", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        <BuiltByDevelopers
          title={"Built by Developers"}
          name={"Meddy"}
          description={
            "From colors, cards, typography to complex elements, you will find the full documentation."
          }
          image={
            <Image
              src={logoChakra}
              alt="chakra image"
              minWidth={{ md: "300px", lg: "auto" }}
            />
          }
        />
        <WorkWithTheRockets
          backgroundImage={peopleImage}
          title={"Work with the rockets"}
          description={
            "Wealth creation is a revolutionary recent positive-sum game. It is all about who takes the opportunity first."
          }
        />
      </Grid> */}
		</Flex>
	);
}
