import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService";
import { serverUrl } from "../utils/Info";

const GFitOAuthButton = () => {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const handleGFitOAuth = async () => {
		setIsLoading(true);
		try {
			const idToken = await user?.getIdToken();
			// Get the OAuth URL from the server
			const response = await fetch(serverUrl.http + "/credentials/gfiturl", {
				headers: {
					idtoken: idToken,
				},
			});
			console.log(response);
			const data = await response.json();
			if (data.status === "success") {
				// Redirect the user to the Google Fit OAuth page
				window.location.href = data.data.url;
			} else {
				console.error("Failed to get Google Fit OAuth URL");
			}
		} catch (error) {
			console.error("Error initiating Google Fit OAuth:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to handle the callback
	const handleCallback = async () => {
		if (!user) {
			return;
		}
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		const idToken = await user?.getIdToken();

		if (code) {
			try {
				const response = await fetch(serverUrl.http + "/credentials/gfitcode", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						idtoken: idToken,
					},
					body: JSON.stringify({
						code,
					}),
				});

				const data = await response.json();
				if (data.status === "success") {
					console.log("Google Fit connected successfully");
					// You might want to update the UI or state here to reflect the successful connection
				} else {
					console.error("Failed to save Google Fit token");
				}
			} catch (error) {
				console.error("Error handling Google Fit callback:", error);
			}
		}
	};

	// Check for the code in the URL when the component mounts
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (code) {
			handleCallback();
		}
	}, [user]);

	return (
		<Button onClick={handleGFitOAuth} colorScheme="blue" isLoading={isLoading}>
			Connect Google Fit
		</Button>
	);
};

export default GFitOAuthButton;
