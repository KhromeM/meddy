import React, { useEffect } from "react";
import {
	Box,
	VStack,
	Heading,
	Text,
	Button,
	Image,
	HStack,
	SimpleGrid,
	Flex,
} from "@chakra-ui/react";
import { images } from "../../../assets/images";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";
import "../../styles/button.css";
import CardsInterface from "../CardsInterface";
import { Gradient } from "../Gradient"; // Import the Gradient class
import "../../styles/gradient.css"; // Import the gradient CSS
import MeddyDemoGif from "../../assets/gif/meddycrop.gif";
import MeddyGif2 from "../../assets/gif/meddy3.gif";

import "../../styles/animatedBG.css";
import Card from "../Card/Card";
import GeminiLogo from "../../assets/img/google-gemini-icon.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import AnimatedDisplay from "./animatedDisplay";

// import computer from "../../assets/img/supercomputer.jpg";
// import chart from "../../assets/gif/data_vis2.gif";
// import ReactVideo from "../../assets/video/reactLanding.mp4";
// import FlutterVideo from "../../assets/video/fluttervideo.mp4";
// import BarGraph from "./graphAnimation/BarGraph.jsx";

const REACT_VIDEO_CDN =
  "https://cdn.discordapp.com/attachments/1270575699987533856/1272945384611643472/reactLanding.mp4?ex=66bcd245&is=66bb80c5&hm=2f8a1d4cfb0d443d3f32a9839dbc9b0f98bff75cf24b0e2f04db46dbb1fa7b8b&";
const FLUTTER_VIDEO_CDN =
  "https://cdn.discordapp.com/attachments/1270575699987533856/1272945332325449748/fluttervideo.mp4?ex=66bcd239&is=66bb80b9&hm=5054423f3a072210edf5896998c82dbf61114f3e1f872d6d66724df2fc43ad43&";

export const Hero = ({ login }) => {
	const history = useHistory();

	useEffect(() => {
		const gradient = new Gradient();
		gradient.initGradient("#gradient-canvas");

		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const maxScroll = 1000;
			const opacity = Math.max(1 - scrollPosition / maxScroll, 0);

			const canvas = document.querySelector("#gradient-canvas");
			if (canvas) {
				canvas.style.opacity = opacity;
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<Box position="relative" width="100vw" overflow="hidden" bg="transparent">
				<canvas
					id="gradient-canvas"
					data-js-darken-top
					data-transition-in
				></canvas>
				<Box mx={2}>
					<Navbar />
				</Box>
				<Box display="flex" justifyContent="center">
					<Box
						display="flex"
						justifyContent="space-between"
						flexDirection={{ base: "column", md: "column", lg: "column" }}
						width="1280px"
						w={{ "2xl": "80%" }}
						alignItems="center"
						textAlign="center"
					>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							height="100%"
							width={{ base: "100%", md: "100%", lg: "100%" }}
							marginTop="9%"
							paddingX="5%"
							bg="transparent"
						>
							<VStack spacing={4} align="center" width="100%">
								<Card
									margin="-7px"
									minHeight="20px"
									maxWidth="150px"
									padding="6px 5px"
									_hover={{
										cursor: "pointer",
									}}
									target="_blank"
									onClick={() => {
										window.open("https://ai.google.dev/competition", "_blank");
									}}
								>
									<Text
										fontSize="11px"
										fontWeight={600}
										display="flex"
										alignItems="center"
										justifyContent="center"
									>
										Powered by{" "}
										<Image boxSize="20px" src={GeminiLogo} margin="2px" />{" "}
										Gemini
									</Text>
								</Card>
								<Heading
									as="h1"
									fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}
									fontWeight="900"
									lineHeight="1.2"
									letterSpacing="-0.02em"
									w={"100%"}
									textAlign={"center"}
								>
									Meddy, your AI health companion
								</Heading>
								<Text
									fontSize={{ base: "16px", md: "22px" }}
									fontWeight="500"
									lineHeight="1.5"
									color="gray.700"
									w={"60%"}
									textAlign={{ base: "center", md: "center", lg: "center" }}
								>
									The world's first AI medical assistant that uses your entire
									medical history to give you the best advice.
								</Text>
								<HStack
									spacing={4}
									alignItems={"stretch"}
									id="1"
									w={"100%"}
									margin={{ base: "auto", lg: "0" }}
									justifyContent={{
										base: "center",
										md: "center",
										lg: "center",
									}}
								>
									<Button
										mt={4}
										onClick={() => {
											history.push("/dashboard/voicemode");
										}}
										className="custom-button"
										fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
										variant="outline"
										w={"fit-content"}
										height="60px"
										width="240px"
										borderWidth={3}
										bgColor="#FAF9F6"
										_hover={{
											bg: "#e2fdfc",
											boxShadow: "sm",
											// transform: "scale(1.05)",
										}}
									>
										Try Voice Mode
									</Button>
								</HStack>
							</VStack>
						</Box>
						<Box
							mt={{ base: "60px", md: "80px", lg: "100px" }}
							mb={{ base: "60px", md: "80px", lg: "100px" }}
							pb={{ base: "40px", md: "60px", lg: "80px" }}
							px={{ base: "80px", md: "100px", lg: "130px" }}
							width="100%"
							height={{ base: "400px", md: "500px", lg: "650px" }}
							position="relative"
							overflow="visible"
						>
							<AnimatedDisplay
								iPadVideoSrc={REACT_VIDEO_CDN}
								phoneVideoSrc={FLUTTER_VIDEO_CDN}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
};
