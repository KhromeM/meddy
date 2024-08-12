# Meddy: Your Friendly Medical Assistant AI

## HIPPA Compliant

Meddy is an app designed to bridge the communication gap between patients and doctors. It primarily caters to:

- Non-English speakers
- Patients who are less technologically savvy
- Patients who do not have someone to talk about their medical issues with

These patients face the following challenges:

1. Difficulty understanding medical jargon or English
2. Trouble following treatment instructions
3. Remembering the correct dosage and time for medication
4. Getting answers for medical questions
5. Hesitation in disclosing personal matters due to weak doctor-patient relationships
6. Infrequent/limited access to doctors

## Key Features:

1. **Extremely Easy to Use:** Given the target demographic, Meddy was made to extremely user friendly. Everything can be done via voice controls

2. **Medical Q&A:** Powered by Large Language Models (LLMs) trained on medical data, and with access to patient data via Gemini's large context window rather than RAG, Meddy can answer patients' medical questions,.

3. **Health Insights + Recommendations:** Utilizes Gemini's large context window to display meaningful correlations based on patient data, providing personalized health insights and actionable recommendations.

4. **Real-time Translation:** Offers speech-to-speech translation to facilitate communication between non-English speaking patients and their doctors during appointments.

5. **Appointment Summary:** Remembers and summarizes appointment accessed via context caching, helping patients recall important information.

6. **Treatment Plan Reminders:** Assists patients in following their treatment plans and medication schedules.

7. **Emotional Support:** Acts as a friendly companion, addressing the emotional aspects of dealing with medical issues. This is crucial, as loneliness and negative emotions can potentially worsen a patient's condition.

## Meddy's Approach:

Meddy functions as an all-around friendly medical assistant AI, striving to help users with any health or medical concerns they may have. By accessing patients' medical records and chat history, Meddy provides personalized assistance and support.

The app's primary goal is to improve patient care by enhancing communication, providing reliable information, and offering emotional support throughout the medical journey.

## Easy deployment

```
ssh root@24.144.94.136
cd /home/meddy/web-frontend && git pull && npm i && npm run build
```

# Project Setup

## Frontend Setup (this frontend is just for testing)

1. Navigate to the frontend directory:
   ```sh
   cd web-frontend
   ```
2. Install the dependencies:
   ```sh
   npm i
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Backend Setup

1. Use openssh set up your ssh credentials, get your public key.

2. Give Za (khromem) your ssh public key, so he can give you access to the VM.

3. SSH into the VM `ssh root@24.144.94.136` TIP: add an alias for this

4. Copy credentials from the server to your local copy. Run these:

```
scp root@24.144.94.136:/home/meddy/backend/firebase/meddyai-firebase-adminsdk-sp4v9-c77c115e48.json  ~/Desktop/meddy/backend/firebase

scp root@24.144.94.136:/home/meddy/backend/extra/meddyai-fedbddffaf83.json ~/Desktop/meddy/backend/extra

scp root@24.144.94.136:/home/meddy/backend/.env ~/Desktop/meddy/backend
```

5. Install postgres if you dont have it.

6. Install the vector extension on postgres.

7. Follow the instructions and run the SQL commands in `meddy/backend/db/schema.sql`

8. cd so youre in `backend/` then run `npm install && npm run test`

9. If tests are failing and you can't figure out why, contact Za (khromem)

## Backend audio test site

1. Have local dev server running

2. Open index.html in /audio-test-website (DO NOT use live server for this)

3. To visualize logs run `node ./extra/logging/visualizeLogs.mjs`, then open `backend/extra/log_visualization/index.html`

## Mobile Setup

### Prerequisites

- android studio (for emus)
- flutter sdk
- flutter extension on vscode
- android/ios emu extension for vscode
- xcode (optional for ios)
- hardware acceleration on
- hot reload on (optional)
- sha1 key for firebase auth tests

1. to debug w/ google auth for flutter, need to add sha1 key to firebase meddymobile console

2. do this by: cd mobile, cd android, ./gradlew signingReport (gives sha1 key u can use to debug)

3. add to firebase console, then download google-services.json and add to ~/mobile/android/app/

4. Navigate to the mobile directory

   ```sh
   cd mobile
   ```

5. Install dependencies

   ```sh
   flutter packages get
   ```

6. Open emulated device via vscode extension / android studio gui

7. Navigate to lib

   ```sh
   cd lib
   ```

8. Use vscode debugger gui to run app, ctrl + s in main.dart will activate hot reload

9. If hot reload doesn't work for you, navigate back to mobile dir and run flutter

```sh
cd ..
flutter run
```
