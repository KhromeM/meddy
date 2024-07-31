import { v4 as uuid } from "uuid";

class AudioService {
	constructor(wsConnection) {
		this.wsConnection = wsConnection;
		this.audioContext = null;
		this.audioQueue1 = [];
		this.audioQueue3 = [];
		this.isPlaying = false;
		this.microphone = null;
		this.lang = "en";
		this.requestId = null;
	}

	initAudioContext() {
		this.audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
	}

	async playAudioChunk(base64Audio) {
		if (!this.audioContext) {
			this.initAudioContext();
		}

		const audioData = atob(base64Audio);
		const arrayBuffer = new ArrayBuffer(audioData.length);
		const view = new Uint8Array(arrayBuffer);
		for (let i = 0; i < audioData.length; i++) {
			view[i] = audioData.charCodeAt(i);
		}

		if (!arrayBuffer || arrayBuffer.byteLength == 0) return;
		try {
			const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
			const source = this.audioContext.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(this.audioContext.destination);
			await new Promise((resolve) => {
				source.onended = () => {
					resolve();
				};
				source.start(0);
			});
		} catch (err) {
			console.error("error playing audio: ", err);
			console.log(arrayBuffer);
		}
	}

	playBestAudio() {
		const loop = setInterval(async () => {
			if (this.isPlaying) return;
			if (this.audioQueue3.length > 0) {
				// if we have the best audio then just play that then end the loop
				this.isPlaying = true;
				await this.playQueue(this.audioQueue3);
				this.isPlaying = false;
				clearInterval(loop);
				return;
			}
			if (this.audioQueue1.length > 0) {
				await this.playQueue(this.audioQueue1);
			}
		}, 250);
	}
	
	async playQueue(audioQueue) {
		await new Promise(async (resolve) => {
			while (audioQueue.length > 0) {
				const chunk = audioQueue.shift();
				try {
					await this.playAudioChunk(chunk);
				} catch (err) {
					console.error("error playing chunk ", err);
				}
			}
			resolve();
		});
	}

	async getMicrophone() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			return new MediaRecorder(stream);
		} catch (error) {
			console.error("Error accessing microphone:", error);
			throw error;
		}
	}

	async startRecording() {
		if (this.microphone) {
			console.warn("Microphone is already recording");
			return;
		}
		this.requestId = uuid();

		this.wsConnection.setHandler("audio_3", (message) => {
			if (message.audio) {
				this.audioQueue3.push(message.audio);
			}
		});
		this.wsConnection.setHandler("audio_1", (message) => {
			if (message.audio) {
				this.audioQueue1.push(message.audio);
			}
		});

		try {
			this.microphone = await this.getMicrophone();
			this.microphone.ondataavailable = this.handleAudioData.bind(this);
			this.microphone.start(1000);
			console.log("Started recording");
		} catch (error) {
			console.error("Error starting microphone:", error);
		}
	}

	async stopRecording() {
		if (!this.microphone) {
			console.warn("No active recording to stop");
			return;
		}

		await new Promise((resolve) => setTimeout(resolve, 50)); // get any audio chunks from the mic that are still being processed
		this.microphone.stop();
		this.microphone = null;
		console.log("Stopped recording");

		this.wsConnection.send({
			type: "audio",
			data: {
				isComplete: true,
				audioChunk: " ",
				reqId: this.requestId,
				lang: this.lang,
			},
		});
		this.requestId = null;
		this.playBestAudio();
	}

	async handleAudioData(event) {
		if (event.data.size > 0 && this.wsConnection.isConnected) {
			try {
				const arrayBuffer = await event.data.arrayBuffer();
				const base64Audio = btoa(
					String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
				);

				this.wsConnection.send({
					type: "audio",
					data: {
						audioChunk: base64Audio,
						mimeType: event.data.type,
						isComplete: false,
						lang: this.lang,
						reqId: this.requestId,
					},
				});
			} catch (error) {
				console.error("Error processing audio data:", error);
			}
		}
	}

	setLanguage(lang) {
		this.lang = lang;
	}
}

export default AudioService;
