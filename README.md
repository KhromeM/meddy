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
