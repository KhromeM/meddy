import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

<<<<<<< HEAD
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(
  __dirname,
  "meddyai-firebase-adminsdk-sp4v9-c77c115e48.json"
);
const serviceAccount = require(serviceAccountPath);
=======
const SA = await import("./meddyai-firebase-adminsdk-sp4v9-c77c115e48.json", {
  assert: { type: "json" },
});
const serviceAccount = SA.default;
>>>>>>> de8a06edf0292480030e11bb391fea988de65fa3

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export const db = app.firestore();
export const auth = getAuth(app);

export const verifyUser = async (idToken) => {
  try {
    return await auth.verifyIdToken(idToken);
  } catch {
    return null;
  }
};
