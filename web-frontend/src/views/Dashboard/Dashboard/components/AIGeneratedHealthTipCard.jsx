import { Badge, Box, Stack, Text } from "@chakra-ui/react";
import Card from "../../../../components/Card/Card";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../firebase/AuthService";

const AIGeneratedHealthTipCard = () => {
	const { user } = useAuth();
	const [tips, setTips] = useState([]);
	useEffect(() => {
		fetchTips();
	}, []);

	const fetchTips = async () => {
		try {
			const response = await fetch("https://trymeddy.com/api/info/tip", {
				headers: {
					idtoken: "dev",
					// idtoken: user?.accessToken, // uncomment this for live functionality
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(data);
			setTips(data.tips);
		} catch (error) {
			console.error("Error fetching tips:", error);
		}
	};

	const coolColors = ["#E0F7FA", "#E3F2FD", "#E8EAF6"];

	return (
		<Card flex="1" padding="30px">
			<Text mb="25px" fontSize="26px" fontWeight="bold">
				Daily Health Tips
			</Text>
			<Stack spacing={4}>
				{tips.length === 0 ? (
					<Box
						// key={index}
						p={4}
						borderWidth="1px"
						borderRadius="lg"
						overflow="hidden"
						bg={coolColors[0]}
						boxShadow="md"
					>
						<Badge borderRadius="full" px="2" colorScheme="teal">
							Fetching from server...
						</Badge>
						<Text mt={2} fontSize="18px" color="gray.700">
							Loading your tips...
						</Text>
					</Box>
				) : null}
				{tips.map((tip, index) => (
					<Box
						key={index}
						p={4}
						borderWidth="1px"
						borderRadius="lg"
						overflow="hidden"
						bg={coolColors[index % coolColors.length]}
						boxShadow="md"
					>
						<Badge borderRadius="full" px="2" colorScheme="teal">
							Tip {index + 1}
						</Badge>
						<Text mt={2} fontSize="18px" color="gray.700">
							{tip}
						</Text>
					</Box>
				))}
			</Stack>
		</Card>
	);
};
export default AIGeneratedHealthTipCard;
