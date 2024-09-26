/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";

admin.initializeApp();

export const setCustomClaims = onCall(
  (request) => {
    if (request) {
      const {uid, claims} = request.data;
      try {
        admin.auth().setCustomUserClaims(uid, claims);
        return {
          message: `Zaktualizowano custom claims dla użytkownika ${uid.toString()}`
        };
      } catch (error: any) {
        console.error("Error setting custom claims:", error);
        throw new HttpsError("internal", error.message || "Wystąpił nieznany błąd");
      }
    }

    throw new HttpsError(
      "permission-denied",
      `Brak uprawnień do ustawienia custom claims.`
    );
  }
);
