import express, { json } from "express";
import cors from "cors";
import { createServer } from "http";
import CONFIG from "./config/serverConfig.mjs";
import chatRoutes from "./routes/chatRoutes.mjs";
import fileRoutes from "./routes/fileRoutes.mjs";
import authMiddleware from "./middleware/authMiddleware.mjs";
import userMiddleware from "./middleware/userMiddleware.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

const app = express();
app.use(cors());
app.use(json());

app.use(authMiddleware);
app.use(userMiddleware);

// API Routes:
app.use("/api/chat", chatRoutes);
app.use("/api/file", fileRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/report", reportRoutes)

app.use(errorHandler);

const server = createServer(app);

server.listen(CONFIG.port, () => {
	console.log("Server is listening to port: " + CONFIG.port);
});
