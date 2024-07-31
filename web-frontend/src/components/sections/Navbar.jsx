import React from "react";
import {
	Box,
	Flex,
	Text,
	Button,
	Image,
	HStack,
	Link,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";

const Navbar = () => {
	return (
		<Box>
			{/* Announcement Bar */}
			<Flex
				bg="black"
				color="white"
				py={2}
				px={4}
				justifyContent="space-between"
				alignItems="center"
			>
				<Text fontSize="sm">Meddy: Your personal medical assistant</Text>
				<HStack spacing={4}>
					<Text fontSize="sm">Now available on iOS and Android</Text>
					<Button size="sm" colorScheme="whiteAlpha" variant="outline">
						Download →
					</Button>
				</HStack>
				<IconButton
					aria-label="Close announcement"
					icon={<CloseIcon />}
					size="sm"
					variant="ghost"
					color="white"
				/>
			</Flex>

			{/* Main Navbar */}
			<Flex
				bg="#FEF9EF"
				py={4}
				px={8}
				justifyContent="space-between"
				alignItems="center"
				borderBottomWidth={1}
				borderColor="black"
			>
				{/* Logo */}
				<Flex alignItems="center">
					<Image src="/assets/meddyLogo.png" alt="Meddy Logo" h="30px" />
					<Text fontSize="xl" fontWeight="bold" ml={2}>
						Meddy
					</Text>
				</Flex>

				{/* Navigation Menu */}
				<HStack spacing={8}>
					<Menu>
						<MenuButton
							as={Button}
							rightIcon={<ChevronDownIcon />}
							variant="ghost"
						>
							PRODUCTS
						</MenuButton>
						<MenuList>
							<MenuItem>Product 1</MenuItem>
							<MenuItem>Product 2</MenuItem>
						</MenuList>
					</Menu>
					<Link>RESEARCH</Link>
					<Menu>
						<MenuButton
							as={Button}
							rightIcon={<ChevronDownIcon />}
							variant="ghost"
						>
							COMPANY
						</MenuButton>
						<MenuList>
							<MenuItem>About Us</MenuItem>
							<MenuItem>Careers</MenuItem>
						</MenuList>
					</Menu>
					<Link>DOCS</Link>
				</HStack>

				{/* Try on Web Button */}
				<Button
					variant="outline"
					borderRadius="full"
					onClick={() => {
						window.location.href = "/chat";
					}}
				>
					TRY ON WEB →
				</Button>
			</Flex>
		</Box>
	);
};

export default Navbar;
