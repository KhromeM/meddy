# Meddy AI Flutter App Frontend Design Document (MVP Focus)

## 1. Overview

Meddy AI is a medical assistant application designed to bridge the communication gap between patients and doctors. The primary target audience is elderly patients with limited English. The app provides a simple, single-screen interface where users interact with an AI assistant through voice or text input.

## 2. User Interface Design

### 2.1 Single Screen Layout

The app consists of a single main screen with the following elements:

- Large chat box occupying most of the screen
- Mascot/icon indicator showing Meddy's current state (listening, speaking, processing)

### 2.2 Chat Box as Central Interface

The chat box serves as the central hub for all interactions and information display:

- Displays both user input and AI responses
- Shows formatted information (e.g., user profile, medical data) directly in the chat flow
- Presents all app functionalities through conversation
- Examples of chat-based interactions:
  - User profile: "Meddy, show me my profile" displays user information in a formatted message
  - Updating information: "Update my phone number to 555-1234" triggers a confirmation and updates the profile
  - Medication reminders: "What medicines do I need to take today?" displays a formatted list in the chat
  - Appointment summaries: "Show my last doctor's visit notes" presents the information in the chat

### 2.3 Mascot/Icon Indicator

- Friendly character representing Meddy
- Changes appearance based on current state:
  - Listening: Ears perked up or eyes wide open (LMK if you have better idea)
  - Speaking: Mouth moving or speech bubble appearing (LMK if you have better idea)
  - Processing: Thinking pose or spinning animation (LMK if you have better idea)

### 2.4 Color Scheme

- Primary colors: White, orange-red, and black (matching Abridge's color scheme)

## 3. Core Functionality

### 3.1 Voice Interaction

#### Interrupt Handling

- Implement continuous voice activity detection
- When user starts speaking while Meddy is talking:
  1. Immediately stop Meddy's audio output
  2. Transition mascot to "listening" state
  3. Begin processing new user input
  4. Discard or truncate Meddy's incomplete response in the chat

#### Pause Detection

- Use a voice activity detection algorithm to identify end of user's speech
- When a pause is detected:
  1. Wait for a short duration (1 second) to confirm end of speech
  2. If no further speech is detected, transition mascot to "processing" state
  3. Stream the server the end of message signal. OR build up the audio and send it at once (lmk which idea is better)
  4. Wait for audio and chat response from server
  5. Play the audio and write the text to the chat box
  - sync these if possible and easy

### 3.2 Text Interaction

- Text input box under the chat display box, allows users to type messages as an alternative to voice input (might be good for getting spelling of names)

### 3.3 WebSocket Connection

- Establish and maintain a WebSocket connection with the backend server (server also supports http and SSE)
- Handle incoming messages from the server and display them in the chat box
- Send user input (voice transcriptions or text) to the server

## 4. Onboarding and User Experience

### 4.1 First-time User Experience

- Display a brief, visual tutorial showcasing example interactions with Meddy directly in the chat interface
- Highlight the app's voice and text input capabilities
- Demonstrate how to ask for help or view user information
- Start asking onboarding questions

## 5. Accessibility Considerations

- Lmk any ideas, app is already very acessible IMO

## 6. Development Priorities

1. Core chat interface and WebSocket connection
2. Voice input and output integration, including interrupt and pause handling
3. Mascot/icon animations and state representations
4. Formatting and display of structured information in chat (e.g., user profiles)
5. Onboarding experience and examples

## 7. Open Issues and Challenges

1. Initial language selection: Need to determine the best approach for setting the user's preferred language on first launch.
2. Spelling and accuracy: Implement a robust system for confirming and correcting important information provided by users.
