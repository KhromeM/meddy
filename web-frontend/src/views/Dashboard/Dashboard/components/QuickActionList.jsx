import { Heading, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import SmallQuickActionCard from "./SmallQuickActionCard";
import {
	CartIcon,
	DocumentIcon,
	GlobeIcon,
	WalletIcon,
} from "../../../../components/Icons/Icons";
import { FcGoogle } from "react-icons/fc";
import { BiSolidPhoneCall } from "react-icons/bi";
import { useContext } from "react";
import { SettingsContext } from "../../../../layouts/Admin";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { RiRobot2Fill } from "react-icons/ri";
import { useGFitOAuth } from "../../../../components/GFitOAuthHook";

const QuickActionList = ({ iconBoxInside }) => {
	const onOpen = useContext(SettingsContext);
	const history = useHistory();
	const textColor = useColorModeValue("#373737", "white");
	const { handleGFitOAuth, isLoading, isConnected } = useGFitOAuth();

	return (
		<>
			<Heading
				color={textColor}
				textAlign="center"
				as="h3"
				fontSize="23px"
				mt="10px"
				mb="28px"
			>
				Quick Actions
			</Heading>

			<SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="27px">
				{/* <SmallQuickActionCard
          title={"Google Fit Integration"}
          amount={"$53,000"}
          percentage={55}
          height="120px"
          // width="60px"
          icon={
            <Icon as={FcGoogle} h={"24px"} w={"24px"} color={"iconBoxInside"} />
          }
          onClick={onOpen}
        /> */}
				<SmallQuickActionCard
					title={"AI Health Suggestions"}
					amount={"$53,000"}
					percentage={55}
					height="120px"
					// width="60px"
					icon={
						<Icon as={RiRobot2Fill} h={"24px"} w={"24px"} color={"white"} />
					}
					onClick={() => {
						setTimeout(() => {
							history.push("/dashboard/health");
						}, 300);
					}}
				/>
				<SmallQuickActionCard
					title={"Listen in Doctor Visit"}
					amount={"+3,020"}
					percentage={-14}
					icon={
						<Icon
							as={BiSolidPhoneCall}
							color="#eeeeee"
							h={"24px"}
							w={"24px"}
							// color={iconBoxInside}
						/>
					}
					onClick={() => {
						setTimeout(() => {
							history.push("/dashboard/voicemode");
						}, 300);
					}}
				/>
				<SmallQuickActionCard
					title={isConnected ? "Google Fit Connected" : "Link Google Fit"}
					amount={isConnected ? "Connected" : "Click to connect"}
					percentage={isConnected ? 100 : 0}
					icon={<Icon as={FcGoogle} h={"24px"} w={"24px"} color={"#eeeeee"} />}
					onClick={handleGFitOAuth}
					isLoading={isLoading}
					disabled={isConnected}
				/>

				<SmallQuickActionCard
					title={"View Files"}
					amount={"$173,000"}
					percentage={8}
					icon={<DocumentIcon h={"24px"} w={"24px"} color={"#eeeeee"} />}
					onClick={() => {
						setTimeout(() => {
							history.push("/dashboard/uploads");
						}, 300);
					}}
				/>
			</SimpleGrid>
		</>
	);
};
export default QuickActionList;
