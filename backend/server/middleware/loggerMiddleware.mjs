const loggerMiddleware = (req, res, next) => {
	const { method, originalUrl, query, body } = req;
	console.log(
		`Request: ${method} ${originalUrl}, Query: ${JSON.stringify(
			query
		)}, Body: ${JSON.stringify(body)}`
	);
	next();
};

export default loggerMiddleware;
