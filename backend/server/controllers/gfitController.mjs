import { getModel } from "../../ai/langAi/setupVertexAI.mjs";
import db from "../../db/db.mjs";
import { fetchGoogleFitData } from "../../utils/googleFit.mjs";

export const getGFitData = async (req, res) => {
	const user = req._dbUser;
	return res.status(200).json({ data: sampleData });

	try {
		const data = await fetchGoogleFitData(user.userid);
		if (!data) {
			return res.status(500).json({ status: "fail", message: "Could not get google fit data" });
		}
		return res.status(200).json({ data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not get google fit data" });
	}
};

export const gFitScores = async (req, res) => {
	const user = req._dbUser;
	const data = sampleData;

	const responseSchema = {
		type: "object",
		properties: {
			sleep: {
				type: "number",
				description:
					"Return a sleep score between 0 and 100. Return 100 if the user sleeps at least 7.5 hours on most days. Otherwise, make a holisitic judgement about the user's sleep quality.",
			},
			steps: {
				type: "number",
				description:
					"Return a step score between 0 and 100. Return 100 if the user takes at least 7,000 steps on most days. Otherwise, make a holisitic judgement about the user's step count.",
			},
		},
	};
	const llm = getModel(responseSchema);
	const request = {
		contents: [
			{
				role: "user",
				parts: [{ text: "Give me my sleep and step scores." }],
			},
		],
		systemInstruction: {
			parts: [
				{
					text: `You are Meddy, a helpful AI assistant. Provide sleep and step integer scores from 0 to 100 based on their health data. Here their information from Google Fit: ${data}`,
				},
			],
		},
	};
	const result = await llm.generateContent(request);
	res.status(200).json(JSON.parse(result.response.candidates[0].content.parts[0].text));
};
const sampleData = {
	data: {
		steps: [
			{
				date: "2024-07-10",
				steps: 5234,
			},
			{
				date: "2024-07-11",
				steps: 7689,
			},
			{
				date: "2024-07-12",
				steps: 6543,
			},
			{
				date: "2024-07-13",
				steps: 8901,
			},
			{
				date: "2024-07-14",
				steps: 4567,
			},
			{
				date: "2024-07-15",
				steps: 9876,
			},
			{
				date: "2024-07-16",
				steps: 6789,
			},
			{
				date: "2024-07-17",
				steps: 5432,
			},
			{
				date: "2024-07-18",
				steps: 7890,
			},
			{
				date: "2024-07-19",
				steps: 8765,
			},
			{
				date: "2024-07-20",
				steps: 6543,
			},
			{
				date: "2024-07-21",
				steps: 9087,
			},
			{
				date: "2024-07-22",
				steps: 5678,
			},
			{
				date: "2024-07-23",
				steps: 7654,
			},
			{
				date: "2024-07-24",
				steps: 8901,
			},
			{
				date: "2024-07-25",
				steps: 6789,
			},
			{
				date: "2024-07-26",
				steps: 9012,
			},
			{
				date: "2024-07-27",
				steps: 7890,
			},
			{
				date: "2024-07-28",
				steps: 6543,
			},
			{
				date: "2024-07-29",
				steps: 8765,
			},
			{
				date: "2024-07-30",
				steps: 5432,
			},
			{
				date: "2024-07-31",
				steps: 9087,
			},
			{
				date: "2024-08-01",
				steps: 7654,
			},
			{
				date: "2024-08-02",
				steps: 8901,
			},
			{
				date: "2024-08-03",
				steps: 6789,
			},
			{
				date: "2024-08-04",
				steps: 9012,
			},
			{
				date: "2024-08-05",
				steps: 7890,
			},
			{
				date: "2024-08-06",
				steps: 6543,
			},
			{
				date: "2024-08-07",
				steps: 8765,
			},
			{
				date: "2024-08-08",
				steps: 5432,
			},
			{
				date: "2024-08-09",
				steps: 9087,
			},
			{
				date: "2024-08-10",
				steps: 7654,
			},
		],
		sleep: [
			{
				date: "2024-07-10",
				totalSleepMinutes: 420,
				sleepSegments: [],
			},
			{
				date: "2024-07-11",
				totalSleepMinutes: 390,
				sleepSegments: [],
			},
			{
				date: "2024-07-12",
				totalSleepMinutes: 450,
				sleepSegments: [],
			},
			{
				date: "2024-07-13",
				totalSleepMinutes: 380,
				sleepSegments: [],
			},
			{
				date: "2024-07-14",
				totalSleepMinutes: 410,
				sleepSegments: [],
			},
			{
				date: "2024-07-15",
				totalSleepMinutes: 440,
				sleepSegments: [],
			},
			{
				date: "2024-07-16",
				totalSleepMinutes: 400,
				sleepSegments: [],
			},
			{
				date: "2024-07-17",
				totalSleepMinutes: 430,
				sleepSegments: [],
			},
			{
				date: "2024-07-18",
				totalSleepMinutes: 460,
				sleepSegments: [],
			},
			{
				date: "2024-07-19",
				totalSleepMinutes: 370,
				sleepSegments: [],
			},
			{
				date: "2024-07-20",
				totalSleepMinutes: 420,
				sleepSegments: [],
			},
			{
				date: "2024-07-21",
				totalSleepMinutes: 450,
				sleepSegments: [],
			},
			{
				date: "2024-07-22",
				totalSleepMinutes: 390,
				sleepSegments: [],
			},
			{
				date: "2024-07-23",
				totalSleepMinutes: 410,
				sleepSegments: [],
			},
			{
				date: "2024-07-24",
				totalSleepMinutes: 440,
				sleepSegments: [],
			},
			{
				date: "2024-07-25",
				totalSleepMinutes: 400,
				sleepSegments: [],
			},
			{
				date: "2024-07-26",
				totalSleepMinutes: 430,
				sleepSegments: [],
			},
			{
				date: "2024-07-27",
				totalSleepMinutes: 460,
				sleepSegments: [],
			},
			{
				date: "2024-07-28",
				totalSleepMinutes: 380,
				sleepSegments: [],
			},
			{
				date: "2024-07-29",
				totalSleepMinutes: 420,
				sleepSegments: [],
			},
			{
				date: "2024-07-30",
				totalSleepMinutes: 450,
				sleepSegments: [],
			},
			{
				date: "2024-07-31",
				totalSleepMinutes: 390,
				sleepSegments: [],
			},
			{
				date: "2024-08-01",
				totalSleepMinutes: 410,
				sleepSegments: [],
			},
			{
				date: "2024-08-02",
				totalSleepMinutes: 440,
				sleepSegments: [],
			},
			{
				date: "2024-08-03",
				totalSleepMinutes: 400,
				sleepSegments: [],
			},
			{
				date: "2024-08-04",
				totalSleepMinutes: 430,
				sleepSegments: [],
			},
			{
				date: "2024-08-05",
				totalSleepMinutes: 460,
				sleepSegments: [],
			},
			{
				date: "2024-08-06",
				totalSleepMinutes: 380,
				sleepSegments: [],
			},
			{
				date: "2024-08-07",
				totalSleepMinutes: 420,
				sleepSegments: [],
			},
			{
				date: "2024-08-08",
				totalSleepMinutes: 450,
				sleepSegments: [],
			},
			{
				date: "2024-08-09",
				totalSleepMinutes: 390,
				sleepSegments: [],
			},
			{
				date: "2024-08-10",
				totalSleepMinutes: 410,
				sleepSegments: [],
			},
		],
		bpm: [
			{
				time: "2024-07-10T08:15:00.000Z",
				bpm: 72,
			},
			{
				time: "2024-07-11T12:30:00.000Z",
				bpm: 78,
			},
			{
				time: "2024-07-12T16:45:00.000Z",
				bpm: 65,
			},
			{
				time: "2024-07-13T20:00:00.000Z",
				bpm: 80,
			},
			{
				time: "2024-07-14T10:15:00.000Z",
				bpm: 70,
			},
			{
				time: "2024-07-15T14:30:00.000Z",
				bpm: 75,
			},
			{
				time: "2024-07-16T18:45:00.000Z",
				bpm: 68,
			},
			{
				time: "2024-07-17T22:00:00.000Z",
				bpm: 82,
			},
			{
				time: "2024-07-18T09:15:00.000Z",
				bpm: 73,
			},
			{
				time: "2024-07-19T13:30:00.000Z",
				bpm: 77,
			},
			{
				time: "2024-07-20T17:45:00.000Z",
				bpm: 69,
			},
			{
				time: "2024-07-21T21:00:00.000Z",
				bpm: 81,
			},
			{
				time: "2024-07-22T11:15:00.000Z",
				bpm: 74,
			},
			{
				time: "2024-07-23T15:30:00.000Z",
				bpm: 76,
			},
			{
				time: "2024-07-24T19:45:00.000Z",
				bpm: 71,
			},
			{
				time: "2024-07-25T23:00:00.000Z",
				bpm: 79,
			},
			{
				time: "2024-07-26T10:15:00.000Z",
				bpm: 72,
			},
			{
				time: "2024-07-27T14:30:00.000Z",
				bpm: 78,
			},
			{
				time: "2024-07-28T18:45:00.000Z",
				bpm: 67,
			},
			{
				time: "2024-07-29T22:00:00.000Z",
				bpm: 83,
			},
			{
				time: "2024-07-30T09:15:00.000Z",
				bpm: 75,
			},
			{
				time: "2024-07-31T13:30:00.000Z",
				bpm: 77,
			},
			{
				time: "2024-08-01T17:45:00.000Z",
				bpm: 70,
			},
			{
				time: "2024-08-02T21:00:00.000Z",
				bpm: 80,
			},
			{
				time: "2024-08-03T11:15:00.000Z",
				bpm: 73,
			},
			{
				time: "2024-08-04T15:30:00.000Z",
				bpm: 76,
			},
			{
				time: "2024-08-05T19:45:00.000Z",
				bpm: 69,
			},
			{
				time: "2024-08-06T23:00:00.000Z",
				bpm: 82,
			},
			{
				time: "2024-08-07T10:15:00.000Z",
				bpm: 74,
			},
			{
				time: "2024-08-08T14:30:00.000Z",
				bpm: 77,
			},
			{
				time: "2024-08-09T18:45:00.000Z",
				bpm: 71,
			},
			{
				time: "2024-08-10T22:00:00.000Z",
				bpm: 79,
			},
		],
	},
};
