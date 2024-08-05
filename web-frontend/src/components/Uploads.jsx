import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Container,
	Heading,
	Button,
	VStack,
	List,
	ListItem,
	Text,
	IconButton,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Box,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { IoCloudUpload, IoTrashBin, IoDocumentText } from "react-icons/io5";
import { useAuth } from "../firebase/AuthService.jsx";
import { serverUrl } from "../utils/Info";

const allowedFormats = [".json", ".txt", ".md", ".xml"];

const Uploads = () => {
	const { user } = useAuth();
	const [files, setFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileContent, setFileContent] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const toast = useToast();

	useEffect(() => {
		fetchFiles();
	}, []);

	const fetchFiles = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const idToken = (await user?.getIdToken(false)) || dev;
			console.log(idToken);
			const response = await axios.get(`${serverUrl.http}/file/health`, {
				headers: { idToken: idToken },
			});
			setFiles(Array.isArray(response.data.files) ? response.data.files : []);
		} catch (err) {
			setError("Failed to fetch files");
			showToast("Failed to fetch files", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			showToast("File size must be less than 5MB", "error");
			return;
		}

		const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
		if (!allowedFormats.includes(fileExtension)) {
			showToast("Invalid file format. Allowed formats: " + allowedFormats.join(", "), "error");
			return;
		}

		try {
			const idToken = (await user?.getIdToken(false)) || dev;
			const formData = new FormData();
			formData.append("file", file);

			await axios.post(`${serverUrl.http}/file/health`, formData, {
				headers: { "Content-Type": "multipart/form-data", idToken: idToken },
			});
			fetchFiles();
			showToast("File uploaded successfully", "success");
		} catch (err) {
			showToast("Failed to upload file", "error");
		}
	};

	const handleDelete = async (filename) => {
		try {
			const idToken = (await user?.getIdToken(false)) || dev;
			await axios.delete(`${serverUrl.http}/file/health/${filename}`, {
				headers: { idToken: idToken },
			});
			fetchFiles();
			showToast("File deleted successfully", "success");
		} catch (err) {
			showToast("Failed to delete file", "error");
		}
	};

	const handleFileClick = async (filename) => {
		try {
			const idToken = (await user?.getIdToken(false)) || dev;
			const response = await axios.get(`${serverUrl.http}/file/health/${filename}`, {
				headers: { idToken: idToken },
			});
			console.log(response.data.content);
			setSelectedFile(filename);
			setFileContent(response.data.content);
			setIsModalOpen(true);
		} catch (err) {
			showToast("Failed to fetch file content", "error");
		}
	};

	const showToast = (message, status) => {
		toast({
			title: message,
			status: status,
			duration: 3000,
			isClosable: false,
		});
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setIsDragging(false);
		const file = event.dataTransfer.files[0];
		handleUpload({ target: { files: [file] } });
	};

	return (
		<Container maxW="container.md" py={8}>
			<VStack spacing={4} align="stretch">
				<Heading as="h1" size="xl">
					Your Health Data
				</Heading>
				<Text>
					Please upload your health data in JSON, TXT, MD, or XML format. The maximum file size is
					5MB.
				</Text>
				<Box
					border="2px"
					borderColor={isDragging ? "blue.300" : "gray.200"}
					borderRadius="md"
					p={4}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					textAlign="center"
					cursor="pointer"
					backgroundColor={isDragging ? "blue.50" : "transparent"}
				>
					<input
						type="file"
						id="file-upload"
						style={{ display: "none" }}
						onChange={handleUpload}
						accept={allowedFormats.join(",")}
					/>
					<Button
						as="label"
						htmlFor="file-upload"
						leftIcon={<Icon as={IoCloudUpload} />}
						colorScheme="blue"
					>
						Upload Health Data
					</Button>
					<Text mt={2}>or drag and drop your file here</Text>
				</Box>
				{isLoading ? (
					<Text>Loading files...</Text>
				) : error ? (
					<Text color="red.500">{error}</Text>
				) : files.length === 0 ? (
					<Text>No health data files uploaded yet.</Text>
				) : (
					<List spacing={3}>
						{files.map((filename) => (
							<ListItem
								key={filename}
								p={2}
								border="1px"
								borderColor="gray.200"
								borderRadius="md"
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Button
									variant="link"
									onClick={() => handleFileClick(filename)}
									leftIcon={<Icon as={IoDocumentText} />}
								>
									{filename}
								</Button>
								<IconButton
									icon={<Icon as={IoTrashBin} />}
									onClick={() => handleDelete(filename)}
									aria-label="Delete file"
									colorScheme="red"
									size="sm"
								/>
							</ListItem>
						))}
					</List>
				)}
			</VStack>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{selectedFile}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text whiteSpace="pre-wrap">{fileContent}</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={() => setIsModalOpen(false)}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	);
};

export default Uploads;
