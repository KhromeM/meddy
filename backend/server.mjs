import CONFIG from "./server/config.mjs";
import { server } from "./server/routes.mjs";

server.listen(CONFIG.port, () => {
	console.log("Server is listening to port: " + CONFIG.port);
});
