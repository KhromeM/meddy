class AudioService {
	constructor(wsConnection) {
		this.wsConnection = wsConnection;
		this.audioContext = null;
		this.audioQueue = [];
		this.isPlaying = false;
		this.microphone = null;
		this.lang = "en";
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
		if (!arrayBuffer) return this.playNextChunk();
		const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
		const source = this.audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(this.audioContext.destination);

		source.onended = () => {
			this.isPlaying = false;
			this.playNextChunk();
		};

		source.start(0);
		this.isPlaying = true;
	}

	playNextChunk() {
		console.log("playing chunk");
		if (this.audioQueue.length > 0 && !this.isPlaying) {
			const nextChunk = this.audioQueue.shift();
			try {
				this.playAudioChunk(nextChunk);
			} catch (err) {
				console.error("error playing chunk ", err);
				this.playNextChunk();
			}
		}
	}

	queueAudioChunk(base64Audio) {
		console.log("TIME TO AUDIO: ", Date.now());
		this.audioQueue.push(base64Audio);
		if (!this.isPlaying) {
			this.playNextChunk();
		}
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

		this.microphone.stop();
		this.microphone = null;
		console.log("Stopped recording");

		this.wsConnection.send({
			type: "audio",
			data: {
				isComplete: true,
				audioChunk: " ",
			},
		});
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
