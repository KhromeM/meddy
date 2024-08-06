import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { serverUrl } from "../utils/Info";

export const chatLLMStreamWS = async (
  wsConnection,
  message,
  onChunk,
  onComplete
) => {
  console.log(wsConnection);
  if (
    !wsConnection ||
    !wsConnection.isConnected ||
    !wsConnection.authenticated
  ) {
    console.error("WebSocket is not open or not authenticated");
    onComplete("WebSocket is not ready. Please try again.");
    return;
  }

  const reqId = uuidv4();
  console.log("Sending message:", message);

  wsConnection.send({
    type: "chat",
    data: {
      text: message.text,
      reqId,
    },
  });

  wsConnection.setHandler("chat_response", (response) => {
    if (response.reqId != reqId) return;
    onChunk(response);
    if (response.isComplete) {
      onComplete();
    }
  });

  wsConnection.setHandler("error", (error) => {
    console.error("WebSocket error:", error);
    onComplete("WebSocket Error");
  });
};

export const getChatHistory = async (user) => {
  const token = user?.stsTokenManager?.accessToken; 
  try {
    const response =await axios.get(
      `${serverUrl.http}/chat`,
      {
        headers: {
          "Content-Type": "application/json",
          idToken: token,
        },
      }
    ); 
    return response.data.chatHistory;
  } catch (error) {
    console.error(
      "Error retriving chat history:",
      error.response?.data?.message || error.message
    );
  }
};
