# Meddy: Your Friendly Medical Assistant AI [Hippa Compliant]

## HIPPA Compliant

Meddy is an app designed to bridge the communication gap between patients and doctors. It primarily caters to:

- Elderly patients
- Non-English speakers
- Patients who are less technologically savvy
- Patients who do not have someone to talk about their medical issues with (WIP)

These patients face the following challenges:

1. Difficulty understanding medical jargon or English
2. Trouble following treatment instructions
3. Remembering the correct dosage and time for medication
4. Getting answers for medical questions
5. Hesitation in disclosing personal matters due to weak doctor-patient relationships
6. Infrequent/limited access to doctors

## Key Features:

1. **Extremely Easy to Use:** Given the target demographic, Meddy was made to extremely user friendly. Everything can be done via voice controls

2. **Medical Q&A:** Powered by Large Language Models (LLMs) trained on medical data, and with access to patient data, Meddy can answer patients' medical questions.

3. **Real-time Translation:** Offers speech-to-speech translation to facilitate communication between non-English speaking patients and their doctors during appointments.

4. **Appointment Summary:** Remembers and summarizes appointment details, helping patients recall important information.

5. **Treatment Plan Reminders:** Assists patients in following their treatment plans and medication schedules.

6. **Emotional Support:** Acts as a friendly companion, addressing the emotional aspects of dealing with medical issues. This is crucial, as loneliness and negative emotions can potentially worsen a patient's condition.

## Meddy's Approach:

Meddy functions as an all-around friendly medical assistant AI, striving to help users with any health or medical concerns they may have. By accessing patients' medical records and chat history, Meddy provides personalized assistance and support.

The app's primary goal is to improve patient care by enhancing communication, providing reliable information, and offering emotional support throughout the medical journey.

# Project Setup

## Frontend Setup

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

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Create a `.env` file in the backend directory.

3. Obtain your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4. Add the Gemini API key to the `.env` file as `GEMINI_KEY`.

5. Ensure you are added to the Firebase project.

6. Download the Firebase service account JSON file from the [Firebase Console](https://console.firebase.google.com/u/0/project/meddyai/settings/serviceaccounts/adminsdk).

7. Add the JSON file to the `backend/firebase` directory.

8. Update the import path in `backend/firebase/firebase.mjs`:

   ```javascript
   const SA = await import("./path-to-your-json-file.json", {
   	assert: { type: "json" },
   });
   ```

   Replace `"./path-to-your-json-file.json"` with the actual path to your JSON file.

9. Start the backend server:
   ```sh
   npm run start
   ```
