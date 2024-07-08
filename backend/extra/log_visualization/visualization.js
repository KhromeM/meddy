const logData = [{"timestamp":"2024-07-08T15-28-38.961Z","query":"Hello. What's your name? ","queryLength":25,"language":"en","model":"llama3-70b-8192","llmResponse":"Hello! My name is Meddy. How can I assist you with your health or medical care today? 😊","llmResponseLength":88,"transcriptionLatency":719,"llmLatency":531,"ttsLatency":4515,"totalLatency":5765},{"timestamp":"2024-07-08T15-50-53.745Z","query":" Hey, Mady. What's your name? ","queryLength":30,"language":"en","model":"llama3-70b-8192","llmResponse":"Hello! My name is Meddy. How can I assist you with your health or medical care today? 😊","llmResponseLength":88,"transcriptionLatency":476,"llmLatency":483,"ttsLatency":3849,"totalLatency":4808},{"timestamp":"2024-07-08T15-51-16.996Z","query":" What's 2 plus 2?","queryLength":17,"language":"en","model":"llama3-70b-8192","llmResponse":"2 plus 2 equals 4. If you have any health or medical care questions, feel free to ask! 😊","llmResponseLength":89,"transcriptionLatency":531,"llmLatency":6460,"ttsLatency":7396,"totalLatency":14387},{"timestamp":"2024-07-08T15-51-52.186Z","query":" What's the capital of the US?","queryLength":30,"language":"en","model":"llama3-70b-8192","llmResponse":"The capital of the US is Washington, D.C. If you have any health or medical care questions, feel free to ask! 😊","llmResponseLength":112,"transcriptionLatency":220,"llmLatency":13499,"ttsLatency":6801,"totalLatency":20520},{"timestamp":"2024-07-08T15-52-27.029Z","query":"Who is Abraham Lincoln? ","queryLength":24,"language":"en","model":"llama3-70b-8192","llmResponse":"Abraham Lincoln was the 16th President of the United States. If you have any health or medical care questions, feel free to ask! 😊","llmResponseLength":131,"transcriptionLatency":910,"llmLatency":14448,"ttsLatency":3993,"totalLatency":19351},{"timestamp":"2024-07-08T15-53-10.845Z","query":"What's 5 plus 5? ","queryLength":17,"language":"en","model":"gpt-4o","llmResponse":"5 plus 5 equals 10. If you have any health or medical care questions, feel free to ask! 😊","llmResponseLength":90,"transcriptionLatency":514,"llmLatency":1542,"ttsLatency":1210,"totalLatency":3266},{"timestamp":"2024-07-08T15-53-23.651Z","query":"Can you ride up a","queryLength":17,"language":"en","model":"gpt-4o","llmResponse":"It seems like your message got cut off. How can I assist you with your health or medical care today? 😊","llmResponseLength":103,"transcriptionLatency":123,"llmLatency":818,"ttsLatency":1351,"totalLatency":2292},{"timestamp":"2024-07-08T15-53-39.139Z","query":" How fast can you run  ","queryLength":23,"language":"en","model":"gpt-4o","llmResponse":"I don't run, but I'm here to help you with any health or medical care questions you might have. How can I assist you today? 😊","llmResponseLength":126,"transcriptionLatency":636,"llmLatency":900,"ttsLatency":1174,"totalLatency":2710},{"timestamp":"2024-07-08T15-53-51.293Z","query":"Why don't you run","queryLength":17,"language":"en","model":"gpt-4o","llmResponse":"I’m here to assist you with your health and medical care questions. How can I help you today? 😊","llmResponseLength":96,"transcriptionLatency":1403,"llmLatency":1062,"ttsLatency":1617,"totalLatency":4082},{"timestamp":"2024-07-08T15-54-09.984Z","query":" Can you run today? ","queryLength":20,"language":"en","model":"gpt-4o","llmResponse":"I don't run, but I'm here to help you with any health or medical care questions you might have. How can I assist you today? 😊","llmResponseLength":126,"transcriptionLatency":596,"llmLatency":850,"ttsLatency":3484,"totalLatency":4930},{"timestamp":"2024-07-08T15-54-23.159Z","query":"123. ","queryLength":5,"language":"en","model":"gpt-4o","llmResponse":"It seems like your message got cut off. How can I assist you with your health or medical care today? 😊","llmResponseLength":103,"transcriptionLatency":873,"llmLatency":930,"ttsLatency":926,"totalLatency":2729},{"timestamp":"2024-07-08T15-54-36.299Z","query":"¿Cómo estás?","queryLength":12,"language":"es","model":"gpt-4o","llmResponse":"Estoy bien, gracias. ¿Y tú? ¿Cómo te sientes hoy? ¿Hay algo en lo que pueda ayudarte con respecto a tu salud? 😊","llmResponseLength":112,"transcriptionLatency":152,"llmLatency":1024,"ttsLatency":1500,"totalLatency":2676},{"timestamp":"2024-07-08T15-54-49.688Z","query":"¿Cómo te llamas? ","queryLength":17,"language":"es","model":"gpt-4o","llmResponse":"Me llamo Meddy. ¿En qué puedo ayudarte con respecto a tu salud hoy? 😊","llmResponseLength":70,"transcriptionLatency":1059,"llmLatency":770,"ttsLatency":997,"totalLatency":2826},{"timestamp":"2024-07-08T15-58-00.464Z","query":" A gpt4. ","queryLength":9,"language":"en","model":"gpt-4o","llmResponse":"Soy Meddy, tu asistente médico. ¿En qué puedo ayudarte con respecto a tu salud hoy? 😊","llmResponseLength":86,"transcriptionLatency":1097,"llmLatency":956,"ttsLatency":813,"totalLatency":2866},{"timestamp":"2024-07-08T15-58-13.054Z","query":"Can you speak English? ","queryLength":23,"language":"en","model":"gpt-4o","llmResponse":"Yes, I can speak English. How can I assist you with your health or medical care today? 😊","llmResponseLength":89,"transcriptionLatency":247,"llmLatency":894,"ttsLatency":826,"totalLatency":1967},{"timestamp":"2024-07-08T15-58-25.376Z","query":"Are you GPT 4","queryLength":13,"language":"en","model":"gpt-4o","llmResponse":"I'm Meddy, your medical assistant. My purpose is to help you with your health and medical care questions. How can I assist you today? 😊","llmResponseLength":136,"transcriptionLatency":918,"llmLatency":809,"ttsLatency":1575,"totalLatency":3302}];
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
