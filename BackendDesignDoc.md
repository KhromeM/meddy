# Meddy AI Backend Design Document

## 1. Overview

The Meddy AI backend is a Node.js server that:

- Supports communication via HTTP, SSE (Server-Sent Events), and WebSockets
- Uses Google for authentication
- Is hosted on a Digital Ocean droplet
- Uses a local PostgreSQL instance for data storage
- Has requests routed to it via Nginx
- Is managed by PM2

Its main function is to:

1. Receive messages from the client
2. Add context to the message
3. Pass it through an LLM (Language Model)
4. Return the response

## 2. Authentication

- Client logs in with Google
- Client sends the logged-in user's idToken in the request header or body
- Server verifies the idToken before handling the request

## 3. Message Processing

### 3.1 Text-based Queries

1. Server receives the request/message
2. Fetches the user's last 100 messages
3. Adds this to the message history along with a system prompt
4. Queries the LLM
5. Streams the response back to the client

### 3.2 Message Classification

- Uses Gemma on Groq for fast classification
- Classifies messages as either:
  - User information request/update
  - Medical question

### 3.3 User Information Requests

- Attaches all user info and short chat history (50 messages)
- Passes to Groq
- Expects structured output, e.g.:

```
{
display: "name: john doe\nphone number: 123-456-7980\n...",
functions: ['setPhoneNumber("1234567980")', 'log("changed phone number to ...")']
}
```

### 3.4 Medical Questions

- Adds user's medical info and long chat history (100-1000 messages)
- Passes to Gemini-1.5-pro
- System prompts emphasize:
- Not giving risky medical advice
- Adhering to the patient's doctor's advice
- Not scaring the patient
- Using easy-to-understand language without jargon

### RAG

- The server has functionality to take uploaded files and chunk them for rag
- Not sure if were acutally going to use this however.

## Appointment Mode

- Takes notes on what happens during doctors appointments
- Saves notes and a summary. Adds summary as context to all future medical questions

### 3.5 Non-English Users

- Always uses the more powerful model (Gemini-1.5-pro)

## 4. Audio Processing

- Supports both complete audio file uploads and streaming audio blobs
- Uses Groq's Whisper 3 API for transcription
- Processes transcribed text like normal English text
- Adds a system prompt specifying the input language and requesting English output
- Uses Eleven Labs for text-to-speech conversion
- Considering whether to wait for complete LLM response or send shorter chunks to Eleven Labs

## 5. Testing

We implement tests for the backend to avoid debugging directly on the virtual machine. Our testing approach includes:

- Direct API calls without mocking
- Actual database interactions on a test db
- Full integration tests that simulate real-world scenarios

This approach allows us to:

1. Verify the entire system's functionality
2. Catch issues that might only appear in a production-like environment
3. Ensure all components (server, database, external APIs) work together correctly

We run these tests locally before deploying to the production environment. You really dont want to debug on the server.

## 6. Challenges

- Maintaining low latency for real-time conversations
- Balancing text-to-speech chunk size for performance vs context-dependent speech quality
- Proof it can be done: retellai.com (at least check out their demo)

This backend design enables the client Flutter app to handle all functionalities through its chat interface, whether text or voice-based.
