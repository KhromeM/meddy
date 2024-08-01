import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useAuth } from "../firebase/AuthService";

const Message = ({ message, isStreaming }) => {
	const { text, isUser, result } = message;
	const { user } = useAuth();
	let userName = user?.displayName || "You";
	userName = userName.split(" ")[0];

	console.log(message);
	const getBackgroundColor = () => {
		if (!result) return isUser ? "white" : "#fff2e4";
		return result.success ? "green.50" : "red.50";
	};

	const getIcon = () => {
		if (!result) return null;
		return result.success ? (
			<CheckCircleIcon color="green.500" />
		) : (
			<WarningIcon color="red.500" />
		);
	};

	return (
		<Box
			alignSelf={isUser ? "flex-end" : "flex-start"}
			bg={getBackgroundColor()}
			p={3}
			borderRadius="lg"
			maxW="70%"
			borderWidth={1}
			borderColor={
				result ? (result.success ? "green.200" : "red.200") : "#843a06"
			}
		>
			<Flex alignItems="center" mb={2}>
				{getIcon()}
				<Text ml={2} fontWeight="bold">
					{isUser ? userName : "Meddy"}
				</Text>
			</Flex>
			<ReactMarkdown components={markDownComponents}>{text}</ReactMarkdown>
			{isStreaming && (
				<Text as="span" animation="blink 1s infinite">
					...
				</Text>
			)}
		</Box>
	);
};

export default Message;

const markDownComponents = {
	p: ({ children }) => <Text whiteSpace="pre-wrap">{children}</Text>,
	h1: ({ children }) => (
		<Text fontSize="2xl" fontWeight="bold">
			{children}
		</Text>
	),
	h2: ({ children }) => (
		<Text fontSize="xl" fontWeight="bold">
			{children}
		</Text>
	),
	h3: ({ children }) => (
		<Text fontSize="lg" fontWeight="bold">
			{children}
		</Text>
	),
	ul: ({ children }) => (
		<Box as="ul" pl={4}>
			{children}
		</Box>
	),
	ol: ({ children }) => (
		<Box as="ol" pl={4}>
			{children}
		</Box>
	),
	li: ({ children }) => (
		<Box as="li" mb={2}>
			{children}
		</Box>
	),
	code: ({ inline, children }) =>
		inline ? (
			<Text as="code" bg="gray.100" p={1} borderRadius="sm">
				{children}
			</Text>
		) : (
			<Box as="pre" bg="gray.100" p={2} borderRadius="md" overflowX="auto">
				<Text as="code">{children}</Text>
			</Box>
		),
};
