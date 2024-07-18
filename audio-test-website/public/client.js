const captions = document.getElementById("captions");
let chatResponse = "";
let userText = "";
let audioContext;
let audioQueue = [];
let isPlaying = false;
let time = null;
const langSelect = document.getElementById("language-select");
let lang = "en";

const getInner = () => {
	return `
        <div class="message llm">
            <div class="label">LLM:</div>
            <p>${chatResponse || "Waiting for response..."}</p>
        </div>
        <div class="message user">
            <div class="label">User:</div>
            <p>${userText || "Listening..."}</p>
        </div>
    `;
};

function initAudioContext() {
	audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

async function playAudioChunk(base64Audio) {
	if (!audioContext) {
		initAudioContext();
	}

	const audioData = atob(base64Audio);
	const arrayBuffer = new ArrayBuffer(audioData.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < audioData.length; i++) {
		view[i] = audioData.charCodeAt(i);
	}
	if (!arrayBuffer) return playNextChunk();
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
	const source = audioContext.createBufferSource();
	source.buffer = audioBuffer;
	source.connect(audioContext.destination);

	source.onended = () => {
		isPlaying = false;
		playNextChunk();
	};

	source.start(0);
	isPlaying = true;
}

function playNextChunk() {
	if (audioQueue.length > 0 && !isPlaying) {
		const nextChunk = audioQueue.shift();
		try {
			playAudioChunk(nextChunk);
		} catch (err) {
			console.error("error playing chunk ", err);
			playNextChunk();
		}
	}
}

function queueAudioChunk(base64Audio) {
	console.log("TIME TO AUDIO: ", Date.now() - time);
	audioQueue.push(base64Audio);
	if (!isPlaying) {
		playNextChunk();
	}
}

async function getMicrophone() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		return new MediaRecorder(stream);
	} catch (error) {
		console.error("Error accessing microphone:", error);
		throw error;
	}
}

async function openMicrophone(microphone, socket) {
	return new Promise((resolve) => {
		microphone.onstart = () => {
			chatResponse = "";
			userText = "";
			audioQueue = [];
			isPlaying = false;
			captions.innerHTML = getInner();
			console.log("WebSocket connection opened");
			document.body.classList.add("recording");
			resolve();
		};

		microphone.onstop = () => {
			console.log("WebSocket connection closed");
			document.body.classList.remove("recording");
		};

		microphone.ondataavailable = async (event) => {
			if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
				try {
					const arrayBuffer = await event.data.arrayBuffer();
					const base64Audio = btoa(
						String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
					);

					socket.send(
						JSON.stringify({
							type: "audio",
							data: {
								audioChunk: base64Audio,
								mimeType: event.data.type,
								isComplete: false,
								lang,
							},
						})
					);
				} catch (error) {
					console.error("Error processing audio data:", error);
				}
			}
		};

		microphone.start(1000);
	});
}

async function closeMicrophone(microphone, socket) {
	microphone.stop();
	time = Date.now();
	console.log("SENT END OF AUDIO SIGNAL");
	socket.send(
		JSON.stringify({
			type: "audio",
			data: {
				isComplete: true,
			},
		})
	);
}

async function start(socket) {
	const listenButton = document.querySelector("#record");
	let microphone;

	console.log("client: waiting to open microphone");

	listenButton.addEventListener("click", async () => {
		event.preventDefault();
		if (!microphone) {
			try {
				microphone = await getMicrophone();
				await openMicrophone(microphone, socket);
			} catch (error) {
				console.error("Error opening microphone:", error);
			}
		} else {
			await closeMicrophone(microphone, socket);
			microphone = undefined;
		}
	});
}
const dev = "ws://localhost:8000/api";
const server = "wss://trymeddy.com/api/";
window.addEventListener("load", () => {
	const socket = new WebSocket(server || dev);
	langSelect.addEventListener("change", (event) => {
		event.preventDefault();

		lang = event.target.value;
		console.log("Selected language:", lang);
	});
	socket.addEventListener("open", async () => {
		console.log("WebSocket connection opened");
		socket.send(
			JSON.stringify({
				type: "auth",
				data: {
					idToken: "dev",
				},
			})
		);
		await new Promise((resolve) => setTimeout(resolve, 100));

		await start(socket);
	});

	socket.addEventListener("message", async (event) => {
		const data = JSON.parse(event.data);
		console.log(data.type, data);

		if (data.type === "chat_response") {
			chatResponse += data.data;
		} else if (data.type === "partial_transcript") {
			userText += data.data + " ";
		} else if (data.type.slice(0, 5) === "audio") {
			queueAudioChunk(data.audio);
		}
		captions.innerHTML = getInner();
		captions.scrollTop = captions.scrollHeight;
	});

	socket.addEventListener("close", () => {
		console.log("WebSocket connection closed");
	});
});
