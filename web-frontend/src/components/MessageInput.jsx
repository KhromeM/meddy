import React, { useState, useCallback } from "react";
import { Flex, Input, IconButton } from "@chakra-ui/react";
import { FaMicrophone, FaAngleRight, FaRegStopCircle } from "react-icons/fa";

const MessageInput = ({ onSend, inProgress, toggleAudio, audioMode }) => {
	const [text, setText] = useState("");

	const handleSend = useCallback(() => {
		if (text.trim() && !inProgress) {
			onSend({ text: text.trim(), isUser: true });
			setText("");
		}
	}, [text, inProgress, onSend]);

	const handleKeyPress = useCallback((e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}, [handleSend]);

	return (
		<Flex
			margin={10}
			p={4}
			bg="white"
			borderTopWidth={1}
			borderColor="gray.200"
			borderRadius={"xl"}
		>
			<Flex
				flex={1}
				borderWidth={1}
				borderColor="gray.200"
				borderRadius="full"
				bg="white"
				align="center"
				mr={2}
			>
				<Input
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type message..."
					border="none"
					_focus={{ boxShadow: "none" }}
				/>
				<IconButton
					icon={<FaAngleRight />}
					onClick={handleSend}
					isDisabled={inProgress || !text.trim()}
					aria-label="Send message"
					size="lg"
				/>
			</Flex>
			<IconButton
				icon={audioMode ? <FaRegStopCircle /> : <FaMicrophone />}
				colorScheme="orange"
				aria-label="Voice input"
				borderRadius="full"
				size="lg"
				onClick={toggleAudio}
			/>
		</Flex>
	);
};

export default MessageInput;
