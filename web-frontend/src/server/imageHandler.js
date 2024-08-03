import axios from "axios";
import { serverUrl } from "../utils/Info";

const baseUrl = serverUrl.http;
const readFileAsBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			resolve(reader.result.split(",")[1]);
		};

		reader.onerror = (error) => {
			reject(error);
		};

		reader.readAsDataURL(file);
	});
};
export const uploadImage = async (file, user) => {
	const token = user?.stsTokenManager?.accessToken;
	const userid = user?.uid;
	const base64data = await readFileAsBase64(file);
	const payload = {
		image: {
			name: file.name,
			data: base64data,
		},
		idToken: token,
	};
	try {
		const response = await axios.post(
			`${baseUrl}/image?userId=${userid}`,
			payload,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	} catch (error) {
		console.error(
			"Error uploading image:",
			error.response?.data?.message || error.message
		);
	}
};

export const getImage = (file, user) => {
	const token = user?.stsTokenManager?.accessToken;
	const userid = user?.uid;
	const fileName = file?.name;

	try {
		const response = axios.get(
			`${baseUrl}/image/base64?image=${fileName}&userId=${userid}`,
			{
				headers: {
					"Content-Type": "application/json",
					idToken: token,
				},
			}
		);
		return response;
	} catch (error) {
		console.error(
			"Error retriving image:",
			error.response?.data?.message || error.message
		);
	}
};
