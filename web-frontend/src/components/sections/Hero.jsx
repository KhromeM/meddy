import React, { useRef, useEffect, useState } from "react";
import {
	Box,
	VStack,
	Heading,
	Text,
	Button,
	Image,
	HStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";

export const Hero = ({ login }) => {
	

	return (
		<Box position="relative" minHeight="100vh" width="100vw" overflow="hidden">
			<Navbar />
			<Image
				src="/assets/dp7zbu6zhiy3wuc2ksrz-1@2x.png"
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				objectFit="cover"
				zIndex="-2"
			/>
			
			<VStack
				spacing={6}
				align="flex-start"
				justify="center"
				height="100%"
				maxW={{ base: "90%", md: "70%", lg: "50%" }}
				marginTop={"10%"}
				marginLeft={"10%"}
			>
				<Heading
					as="h1"
					fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
					// fontWeight="bold"
					lineHeight="1.2"
					letterSpacing="-0.02em"
				>
					Medical Assistant Powered by Gemini{" "}
				</Heading>
				<Text
					fontSize={{ base: "xl", md: "2xl" }}
					fontWeight="medium"
					lineHeight="1.5"
				>
					Meet the world's first voice powered medical assistant that responds
					empathically, built to align technology with human well-being
				</Text>
				<HStack spacing={4}>
					<Button
						rightIcon={
							<Image
								src="/assets/svg.svg"
								boxSize="1.5rem"
								alt="Download icon"
							/>
						}
						colorScheme="blackAlpha"
					>
						Download App
					</Button>
					<Button
						as={RouterLink}
						to="/login"
						onClick={login}
						rightIcon={
							<Image src="/assets/svg-1.svg" boxSize="1.5rem" alt="Web icon" />
						}
						variant="outline"
					>
						Try on Web
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};
