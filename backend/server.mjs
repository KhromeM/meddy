import CONFIG from "./config.mjs";
import { app } from "./routes.mjs";

app.listen(CONFIG.port, () => {
	console.log("Server is listening to port: " + CONFIG.port);
});
