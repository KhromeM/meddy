import CONFIG from "./server/config.mjs";
import { app } from "./server/routes.mjs";

app.listen(CONFIG.port, () => {
	console.log("Server is listening to port: " + CONFIG.port);
});
