/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {HttpsError, onCall} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from 'firebase-admin/app';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();


export const setCustomClaimsRole = onCall(
  {
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
      throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
    }

    const auth = getAuth()

    if (!auth) {
      throw new HttpsError("failed-precondition", "Server Error, no auth on firebase backend");
    }

    const requestedRole = request.data

    try {
      return await auth.setCustomUserClaims(request.auth.uid, {role: requestedRole})
    } catch (error) {
      throw new HttpsError("internal", `Error creating user ${requestedRole}`, error);
    }
  });


export const updateProfile = onCall(
  {
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
      throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
    }

    const auth = getAuth()

    if (!auth) {
      throw new HttpsError("failed-precondition", "Server Error, no auth on firebase backend");
    }

    const registerForm = request.data

    try {
      await auth.setCustomUserClaims(request.auth.uid, {
        role: "vet",
        address: registerForm.address,
      })
      return {
        success: true,
        message: `Claims with specified role has been set`,
      }
    } catch (error) {
      throw new HttpsError("internal", "Error creating user", error);
    }
  });

export const createUser = onCall({
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
      throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
    }

    const auth = getAuth()

    // auth.createCustomToken()

    if (!auth) {
      throw new HttpsError("failed-precondition", "Server Error, no auth on firebase backend");
    }

    const requestedRole = request.data

    try {
      // const createUser = await auth.createUser({})
      // await createUser.
      await auth.setCustomUserClaims(request.auth.uid, {role: requestedRole})
    } catch (error) {
      throw new HttpsError("internal", `Error creating user ${requestedRole}`, error);
    }
  });
