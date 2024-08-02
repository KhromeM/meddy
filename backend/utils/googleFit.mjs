import db from "../db/db.mjs";
import { getClient } from "./googleAuth.mjs";
import { google } from "googleapis";

export async function fetchGoogleFitData(userId) {
	try {
		// Retrieve the stored credentials
		const credentials = await db.getCredentials(userId, "google_fit");
		if (!credentials) {
			throw new Error("No Google Fit credentials found for this user");
		}

		const client = getClient();
		client.setCredentials(credentials);
		console.log(credentials);
		const fitness = google.fitness({ version: "v1", auth: client });

		// Set time range for last 7 days
		const endTime = new Date();
		const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

		const response = await fitness.users.dataset.aggregate({
			userId: "me",
			requestBody: {
				aggregateBy: [
					{
						dataTypeName: "com.google.step_count.delta",
						dataSourceId:
							"derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
					},
				],
				bucketByTime: { durationMillis: 86400000 }, // 1 day
				startTimeMillis: startTime.getTime(),
				endTimeMillis: endTime.getTime(),
			},
		});

		// Process and return the data
		const stepCounts = response.data.bucket.map((bucket) => ({
			date: new Date(parseInt(bucket.startTimeMillis))
				.toISOString()
				.split("T")[0],
			steps: bucket.dataset[0].point[0]?.value[0]?.intVal || 0,
		}));
		console.log(response);
		console.log(stepCounts);

		return stepCounts;
	} catch (error) {
		console.error("Error fetching Google Fit data:", error);
		throw error;
	}
}

fetchGoogleFitData("c4VLVWO343bC2psxtOXnaITIi2t2");
