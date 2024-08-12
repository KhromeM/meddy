import { v4 as uuid } from "uuid";

class AudioService {
  constructor(wsConnection, onAudioResponse) {
    this.wsConnection = wsConnection;
    this.onAudioResponse = onAudioResponse;
    this.audioContext = null;
    this.audioQueue1 = [];
    this.audioQueue3 = [];
    this.isPlaying = false;
    this.recorder = null;
    this.isRecording = false;
    this.lang = "en";
    this.requestId = null;
    this.isAudioQueue1Started = false;
    this.isPlayingBestAudio = false;
  }

  //console logs seen are sean debugging

  initAudioContext() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
      console.log("Audio context initialized");
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

    if (!arrayBuffer || arrayBuffer.byteLength === 0) return;
    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      await new Promise((resolve) => {
        source.onended = () => {
          console.log("Audio chunk finished playing");
          resolve();
        };
        source.start(0);
      });
    } catch (err) {
      console.error("error playing audio: ", err);
    }
  }

  addToQueue(queueNumber, audioChunk, isComplete) {
    const queue = queueNumber === 1 ? this.audioQueue1 : this.audioQueue3;

    if (audioChunk) {
      queue.push(audioChunk);
      console.log(
        `Added chunk to queue ${queueNumber}. Queue length: ${queue.length}`
      );
      this.onAudioResponse(audioChunk, queueNumber, isComplete);
    }

    if (isComplete) {
      console.log(`Queue ${queueNumber} is complete`);
      this.handleCompletion(queueNumber);
    }

    if (isComplete && queueNumber === 3) {
      if (!this.isPlayingBestAudio) {
        console.log("Starting playback of best audio");
        this.playBestAudio();
      }
    }
  }
  //thought process is that if the
  handleCompletion(queueNumber) {
    console.log(`Audio playback completed for queue ${queueNumber}`);
    if (this.onAudioResponse) {
      this.onAudioResponse(null, queueNumber, true);
    }
  }

  playBestAudio() {
    if (this.isPlayingBestAudio) return;
    this.isPlayingBestAudio = true;

    const playAudio = async () => {
      if (this.isPlaying) {
        setTimeout(playAudio, 250);
        return;
      }
      if (this.audioQueue3.length > 0 && !this.isAudioQueue1Started) {
        this.isPlaying = true;
        await this.playQueue(this.audioQueue3);
        console.log("audioqueue3 played")
        this.isPlaying = false;
      } else if (this.audioQueue1.length > 0 && !this.isAudioQueue1Started) {
        this.isAudioQueue1Started = true;
        this.isPlaying = true;
        await this.playQueue(this.audioQueue1);
        console.log("audioqueue1 played");
        this.isPlaying = false;

        if (this.audioQueue3.length > 0) {
          this.isPlaying = true;
          await this.playQueue(this.audioQueue3);
          console.log("audioqueue3 played");
          this.isPlaying = false;
        }
      } else if (this.audioQueue3.length > 0 && this.isAudioQueue1Started) {
        this.isPlaying = true;
        await this.playQueue(this.audioQueue3);
        console.log("audioqueue3 played");
        this.isPlaying = false;
      }
      if (this.audioQueue1.length > 0 || this.audioQueue3.length > 0) {
        setTimeout(playAudio, 250);
      } else {
        this.isPlayingBestAudio = false;
      }
    };
    playAudio();
  }

  async playQueue(audioQueue) {
    while (audioQueue.length > 0) {
      const chunk = audioQueue.shift();
      try {
        await this.playAudioChunk(chunk);
      } catch (err) {
        console.error("error playing chunk ", err);
      }
    }
  }

  async startRecording() {
    if (this.isRecording) {
      console.warn("Already recording");
      return;
    }

    this.requestId = uuid();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new MediaRecorder(stream);
      this.recorder.ondataavailable = this.handleAudioData.bind(this);
      this.recorder.start(1000);
      this.isRecording = true;
      console.log("Started recording");

      this.wsConnection.setHandler("audio_3", (message) => {
        if (message.audio) {
          this.audioQueue3.push(message.audio);
          this.onAudioResponse(message.audio);
        }
      });
      this.wsConnection.setHandler("audio_1", (message) => {
        if (message.audio) {
          this.audioQueue1.push(message.audio);
          this.onAudioResponse(message.audio);
        }
      });
    } catch (error) {
      console.error("Error starting microphone:", error);
      throw error;
    }
  }

  async stopRecording() {
    if (!this.isRecording) {
      console.warn("No active recording to stop");
      return;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        this.recorder.stop();
        this.isRecording = false;
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
        console.log("Stopped recording");

        this.checkForAudioAndPlay();

        resolve();
      }, 50);
    });
  }

  checkForAudioAndPlay() {
    const checkAndPlay = () => {
      if (this.audioQueue1.length > 0 || this.audioQueue3.length > 0) {
        this.playBestAudio();
      } else {
        setTimeout(checkAndPlay, 100);
      }
    };
    checkAndPlay();
  }

  handleAudioData(event) {
    if (event.data.size > 0 && this.wsConnection.isConnected) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = btoa(
          String.fromCharCode.apply(null, new Uint8Array(reader.result))
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
      };
      reader.readAsArrayBuffer(event.data);
    }
  }

  setLanguage(lang) {
    this.lang = lang;
  }
}

export default AudioService;
