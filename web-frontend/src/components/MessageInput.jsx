import React, { useState, useCallback } from "react";
import { Flex, Input, IconButton } from "@chakra-ui/react";
import { FaMicrophone, FaAngleRight, FaRegStopCircle } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { GoPaperclip } from "react-icons/go";

const MessageInput = ({ onSend, inProgress, toggleAudio, audioMode }) => {
	const [text, setText] = useState("");

	const handleSend = useCallback(() => {
		if (text.trim() && !inProgress) {
			onSend(text.trim());
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
			p={2}
				minW={{base: '80%', md: '60%', lg:'800px'}}
				maxW={{base: '100%', md: '80%', lg:'1280px'}}
	
			mx={'auto'}
		>
			<Flex
				flex={1}
				borderWidth={1}
				borderColor="#843A05"
				borderRadius="full"
				bg="white"
				align="center"
				width={'100%'}
				px={4}
				mr={2}
			>
				<IconButton _hover={{background:'transparent'}} bg={'transparent'}
					icon={<GoPaperclip />}
					onClick={handleSend}
					aria-label="upload file"
					size="xl"
				/>
				<Input
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type message..."
					border="none"
					_focus={{ boxShadow: "none" }}
				
				/>
				<IconButton _hover={{background:'transparent'}} bg={'transparent'}
					icon={<VscSend />}
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
