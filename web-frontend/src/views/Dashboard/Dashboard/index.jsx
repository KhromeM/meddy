// Chakra imports
import {
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
import peopleImage from "../../../assets/img/people-image.png";
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
    <Flex
      flexDirection="column"
      // pt={{ base: "120px", md: "75px" }}
      paddingTop="60px"
    >
      <Heading color={titleText} as="h1" size="xl" mb="26px">
        {user ? `Hi, ${user?.displayName || "Guest"}!` : "Hi Guest!"}
      </Heading>
      <SimpleGrid columns={{ sm: 2, md: 2, xl: 3 }} mt="26px" spacing="24px">
        <Card pt="16px" maxW="380">
          <QuickActionList iconBoxInside={iconBoxInside} />
        </Card>
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
      <Grid
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
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "1.3fr 1.7fr" }}
        templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
        gap="24px"
        mb={{ lg: "26px" }}
      >
        <ActiveUsers
          title={"Active Users"}
          percentage={23}
          chart={<BarChart chartData={barChartData} />}
        />
        {/* <SalesOverview
          title={"Sales Overview"}
          percentage={5}
          chart={<LineChart />}
        /> */}
        <MultiChartContainer
          title={"Biomarker Stats"}
          percentage={5}
          chart={<LineChart />}
        />
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        gap="24px"
      >
        <Projects
          title={"Projects"}
          amount={30}
          captions={["Companies", "Members", "Budget", "Completion"]}
          data={dashboardTableData}
        />
        <RemindersCard />
      </Grid>
    </Flex>
  );
}
