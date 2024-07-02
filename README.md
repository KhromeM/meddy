# Meddy: Your Friendly Medical Assistant AI

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

1. Give Za (khromem) your ssh public key, so he can give you access to the VM.

2. SSH into the VM `ssh root@24.144.94.136` TIP: add an alias for this

3. Copy the .env file from the VM to your own `meddy/backend`

4. Copy the google service worker credentials json file from `meddy/backend/extra` to your own copy

5. Install postgres if you dont have it

6. Follow the instructions and run the SQL commands in `meddy/backend/db/schema.sql`

7. cd so youre in `/backend` then run `npm run test`

8. If tests are failing and you can't figure out why, contact Za (khromem)

## Mobile Setup

### Prerequisites

- android studio (for emus)
- flutter sdk
- flutter extension on vscode
- android/ios emu extension for vscode
- xcode (optional for ios)
- hardware acceleration on

2. Navigate to the mobile directory

   ```sh
   cd mobile
   ```

3. Install dependencies

   ```sh
   flutter packages get
   ```

4. Open emulated device via vscode extension / android studio gui

5. Run app

   ```sh
   flutter run
   ```
