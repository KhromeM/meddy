function createChart(canvasId, data, title, yAxisLabel) {
	new Chart(document.getElementById(canvasId), {
		type: "line",
		data: data,
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: title,
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: yAxisLabel,
					},
				},
				x: {
					type: "linear",
					title: {
						display: true,
						text: "Data Point",
					},
					ticks: {
						stepSize: 1,
						callback: function (value, index, values) {
							return index + 1;
						},
					},
				},
			},
		},
	});
}

function getRandomColor() {
	return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function prepareChartData(logData, valueKey, separateBy = "model") {
	const categories = [...new Set(logData.map((log) => log[separateBy]))];
	return {
		labels: logData.map((_, index) => index + 1),
		datasets: categories.map((category) => ({
			label: category,
			data: logData
				.filter((log) => log[separateBy] === category)
				.map((log, index) => ({ x: index + 1, y: log[valueKey] })),
			fill: false,
			borderColor: getRandomColor(),
			tension: 0.1,
		})),
	};
}

function createLatencyCharts() {
	const latencyTypes = [
		{
			key: "transcriptionLatency",
			title:
				"Time Between Last Audio Chunk from Client and End of Transcription",
			id: "timeLastAudioToEndTranscriptionChart",
		},
		{
			key: "llmLatency",
			title: "Time from End of Transcription to First LLM Chunk",
			id: "timeEndTranscriptionToFirstLLMChart",
		},
		{
			key: "ttsLatency",
			title: "Time from First LLM Chunk to First Audio Chunk from TTS",
			id: "timeFirstLLMToFirstAudioTTSChart",
			separateByLanguage: true,
		},
		{
			key: "totalLatency",
			title: "Total Time to First Audio from TTS",
			id: "totalTimeToFirstAudioTTSChart",
			separateByLanguage: true,
		},
	];

	latencyTypes.forEach((type) => {
		const data = prepareChartData(
			logData,
			type.key,
			type.separateByLanguage ? "language" : "model"
		);
		createChart(type.id, data, type.title, "Time (ms)");
	});
}

function createQueryLengthChart() {
	const data = prepareChartData(logData, "queryLength");
	createChart("queryLengthChart", data, "Query Length per Model", "Length");
}

function createResponseLengthChart() {
	const data = prepareChartData(logData, "llmResponseLength");
	createChart(
		"responseLengthChart",
		data,
		"Response Length per Model",
		"Length"
	);
}

function createLanguageChart() {
	const languages = [...new Set(logData.map((log) => log.language))];
	const data = {
		labels: languages,
		datasets: [
			{
				data: languages.map(
					(lang) => logData.filter((log) => log.language === lang).length
				),
				backgroundColor: languages.map(() => getRandomColor()),
			},
		],
	};
	new Chart(document.getElementById("languageChart"), {
		type: "pie",
		data: data,
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: "Query Language Distribution",
				},
				legend: {
					position: "top",
				},
			},
		},
	});
}

function populateTable() {
	const table = document.getElementById("logTable");
	const headers = [
		"Timestamp",
		"Model",
		"Query",
		"Query Length",
		"Language",
		"LLM Response",
		"LLM Response Length",
		"Time between last audio chunk and end of transcription",
		"Time between end of transcription and first llm chunk",
		"Time between end of first llm chunk and first audio chunk from TTS",
		"Total time to get first audio chunk from TTS after getting last audio chunk from client",
	];
	const headerRow = table.insertRow();
	headers.forEach((header) => {
		const th = document.createElement("th");
		th.textContent = header;
		headerRow.appendChild(th);
	});
	logData.forEach((log) => {
		const row = table.insertRow();
		headers.forEach((header) => {
			const cell = row.insertCell();
			let value;
			switch (header) {
				case "Timestamp":
					value = log.timestamp;
					break;
				case "Model":
					value = log.model;
					break;
				case "Query":
					value = log.transcript;
					break;
				case "Query Length":
					value = log.transcript?.length;
					break;
				case "Language":
					value = log.lang;
					break;
				case "LLM Response":
					value = log.llmResponse;
					break;
				case "LLM Response Length":
					value = log.llmResponse?.length;
					break;
				case "Time between last audio chunk and end of transcription":
					value = log.endTranscription - log.lastAudioChunkFromClient;
					break;
				case "Time between end of transcription and first llm chunk":
					value = log.firstLLMChunk - log.endTranscription;
					break;
				case "Time between end of first llm chunk and first audio chunk from TTS":
					value = log.firstAudioChunkFromTTS - log.firstLLMChunk;
					break;
				case "Total time to get first audio chunk from TTS after getting last audio chunk from client":
					value = log.firstAudioChunkFromTTS - log.lastAudioChunkFromClient;
					break;
				default:
					value = "N/A";
			}
			cell.textContent =
				value !== undefined
					? typeof value === "number"
						? value + " ms"
						: value
					: "N/A";
		});
	});
}

createLatencyCharts();
createQueryLengthChart();
createResponseLengthChart();
// createLanguageChart();
// populateTable();
