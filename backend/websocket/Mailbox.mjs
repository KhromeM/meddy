const WebSocketStatus = Object.freeze({
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3,
});

class Mailbox {
	constructor(ws) {
		this.ws = ws;
		this.status = WebSocketStatus.CLOSED;
		this.requests = {};
		this.authorized = false;
	}
}

class Request {
	constructor(id) {
		this.clientAudio = [];
		this.currentTranscription = [];
		this.transcribing = false;
		this.previousTranscription = "";
	}
}
