import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../firebase/AuthService";
import { serverUrl } from "../utils/Info";

export const useGFitOAuth = () => {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);

	const handleGFitOAuth = useCallback(async () => {
		setIsLoading(true);
		try {
			const idToken = await user?.getIdToken();
			const response = await fetch(serverUrl.http + "/credentials/gfiturl", {
				headers: {
					idtoken: idToken,
				},
			});
			const data = await response.json();
			if (data.status === "success") {
				window.location.href = data.data.url;
			} else {
				console.error("Failed to get Google Fit OAuth URL");
			}
		} catch (error) {
			console.error("Error initiating Google Fit OAuth:", error);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	const handleCallback = useCallback(async () => {
		if (!user) return;

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
					body: JSON.stringify({ code }),
				});

				const data = await response.json();
				if (data.status === "success") {
					console.log("Google Fit connected successfully");
					setIsConnected(true);
				} else {
					console.error("Failed to save Google Fit token");
				}
			} catch (error) {
				console.error("Error handling Google Fit callback:", error);
			}
		}
	}, [user]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (code) {
			handleCallback();
		}
	}, [handleCallback]);

	return {
		handleGFitOAuth,
		isLoading,
		isConnected,
	};
};
