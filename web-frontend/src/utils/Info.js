export const googleClientId =
	"136111862564-u0anpbd6voife3pl7vno9lgnfd5t9kqe.apps.googleusercontent.com";

const isProd = import.meta.env.PROD;
export const serverUrl = {
	http: isProd ? "https://www.trymeddy.com/api" : "http://localhost:8000/api",
	ws: isProd ? "wss://www.trymeddy.com/api/" : "ws://localhost:8000/api",
};
