import db from "../db/db.mjs";
import { getClient } from "./googleAuth.mjs";
import { google } from "googleapis";

async function setupAuthenticatedClient(userId) {
	try {
		const credentials = await db.getCredentials(userId, "google_fit");
		if (!credentials) {
			throw new Error("No Google Fit credentials found for this user");
		}

		const client = getClient();
		const { tokens } = await client.refreshToken(credentials.refresh_token);
		client.setCredentials(tokens);
		return google.fitness({ version: "v1", auth: client });
	} catch (error) {
		console.error("Error setting up authenticated client:", error);
		throw error;
	}
}

async function fetchAndParseStepData(fitness) {
	try {
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

		const stepCounts = response.data.bucket.map((bucket) => ({
			date: new Date(parseInt(bucket.startTimeMillis))
				.toISOString()
				.split("T")[0],
			steps: bucket.dataset[0].point[0]?.value[0]?.intVal || 0,
		}));
		console.log(stepCounts);
		return stepCounts;
	} catch (error) {
		console.error("Error fetching and parsing step data:", error);
		throw error;
	}
}
async function fetchAndParseSleepData(fitness) {
	try {
		const endTime = new Date();
		const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
		const sleepKey = {
			1: "Awake",
			2: "Sleep",
			3: "Out-of-bed",
			4: "Light Sleep",
			5: "Deep Sleep",
			6: "REM",
		};

		const response = await fitness.users.dataset.aggregate({
			userId: "me",
			requestBody: {
				aggregateBy: [
					{
						dataTypeName: "com.google.sleep.segment",
					},
				],
				bucketByTime: { durationMillis: 86400000 }, // 1 day
				startTimeMillis: startTime.getTime(),
				endTimeMillis: endTime.getTime(),
			},
		});

		const sleepData = response.data.bucket.map((bucket) => {
			const date = new Date(parseInt(bucket.startTimeMillis))
				.toISOString()
				.split("T")[0];

			const sleepSegments = bucket.dataset[0].point.map((point) => ({
				startTime: new Date(
					parseInt(point.startTimeNanos) / 1000000
				).toISOString(),
				endTime: new Date(parseInt(point.endTimeNanos) / 1000000).toISOString(),
				type: sleepKey[point.value[0].intVal] || "Unknown",
				durationMinutes:
					(parseInt(point.endTimeNanos) - parseInt(point.startTimeNanos)) /
					60000000000,
			}));

			const totalSleepMinutes = sleepSegments.reduce(
				(total, segment) =>
					segment.type !== "Awake" && segment.type !== "Out-of-bed"
						? total + segment.durationMinutes
						: total,
				0
			);

			return {
				date,
				totalSleepMinutes,
				sleepSegments,
			};
		});

		console.log(sleepData);
		return sleepData;
	} catch (error) {
		console.error("Error fetching and parsing sleep data:", error);
		throw error;
	}
}

async function fetchAndParseHeartRateData(fitness) {
	try {
		const endTime = new Date();
		const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

		const response = await fitness.users.dataset.aggregate({
			userId: "me",
			requestBody: {
				aggregateBy: [{ dataTypeName: "com.google.heart_rate.bpm" }],
				bucketByTime: { durationMillis: 86400000 }, // 1 day
				startTimeMillis: startTime.getTime(),
				endTimeMillis: endTime.getTime(),
			},
		});

		const heartRateData = response.data.bucket.map((bucket) => {
			const date = new Date(parseInt(bucket.startTimeMillis))
				.toISOString()
				.split("T")[0];
			const readings = bucket.dataset[0].point.map((point) => ({
				time: new Date(parseInt(point.startTimeNanos) / 1000000).toISOString(),
				bpm: point.value[0].fpVal,
			}));
			return { date, readings };
		});

		console.log(JSON.stringify(heartRateData));
		return heartRateData;
	} catch (error) {
		console.error("Error fetching and parsing heart rate data:", error);
		throw error;
	}
}

export async function fetchGoogleFitData(userId) {
	try {
		const fitness = await setupAuthenticatedClient(userId);
		await fetchAndParseStepData(fitness);
		await fetchAndParseSleepData(fitness);
		await fetchAndParseHeartRateData(fitness);
		return;
	} catch (error) {
		console.error("Error in fetchGoogleFitData:", error);
		throw error;
	}
}

fetchGoogleFitData("c4VLVWO343bC2psxtOXnaITIi2t2");
