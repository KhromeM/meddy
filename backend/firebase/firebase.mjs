import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

const SA = await import("./meddyai-firebase-adminsdk-sp4v9-c77c115e48.json", {
  assert: { type: "json" },
});
const serviceAccount = SA.default;

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
