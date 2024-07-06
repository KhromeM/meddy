const errorHandler = (err, req, res, next) => {
	if (req.ws) {
		if (req.ws.readyState === WebSocket.OPEN) {
			req.ws.send(
				JSON.stringify({ type: "error", message: "Internal server error" })
			);
		}
	} else {
		res.status(500).json({ message: "Internal server error" });
	}
};

export default errorHandler;
