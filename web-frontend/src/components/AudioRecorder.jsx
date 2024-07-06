import React, { useState, useRef } from "react";

const AudioRecorder = ({ ws }) => {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorder = useRef(null);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);

			mediaRecorder.current.ondataavailable = async (event) => {
				if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
					try {
						const arrayBuffer = await event.data.arrayBuffer();
						const base64Audio = btoa(
							String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
						);

						ws.send(
							JSON.stringify({
								type: "audio",
								data: {
									audioChunk: base64Audio,
									mimeType: event.data.type,
									isComplete: false,
								},
							})
						);
					} catch (error) {
						console.error("Error processing audio data:", error);
					}
				}
			};

			mediaRecorder.current.onstop = () => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(
						JSON.stringify({
							type: "audio",
							data: {
								isComplete: true,
							},
						})
					);
				}
			};

			mediaRecorder.current.start(250); // Send audio chunks every 250ms
			setIsRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder.current && isRecording) {
			mediaRecorder.current.stop();
			setIsRecording(false);
		}
	};

	return (
		<div>
			<button onClick={isRecording ? stopRecording : startRecording}>
				{isRecording ? "Stop Recording" : "Start Recording"}
			</button>
		</div>
	);
};

export default AudioRecorder;
