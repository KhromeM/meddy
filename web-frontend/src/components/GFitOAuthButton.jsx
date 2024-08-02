import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService";
import { serverUrl } from "../utils/Info";

const GFitOAuthButton = () => {
	const { user } = useAuth();

	const giveGFitOauth = useGoogleLogin({
		// ux_mode: "redirect",
		redirect_uri: "http://localhost:5173/google-fit-callback",
		flow: "auth-code",
		clientId:
			"136111862564-u0anpbd6voife3pl7vno9lgnfd5t9kqe.apps.googleusercontent.com",
		scope,
		onSuccess: async (codeResponse) => {
			const code = codeResponse.code;
			console.log(code);
			const idToken = await user?.getIdToken();
			// send to server
			const response = await fetch(serverUrl.http + "/credentials/gfit-token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code,
					idToken,
				}),
			});
			console.log(response);

			try {
			} catch (error) {
				console.error("Error fetching Google Fit data:", error);
			}
		},
		onError: (error) => console.error("GiveGFitOauth Failed:", error),
	});

	return (
		<Button onClick={() => giveGFitOauth()} colorScheme="blue">
			Connect Google Fit
		</Button>
	);
};

export default GFitOAuthButton;

const scope =
	"https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.blood_glucose.read https://www.googleapis.com/auth/fitness.blood_pressure.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.body_temperature.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.sleep.read";
