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
import {getFirestore, FieldValue} from 'firebase-admin/firestore';

initializeApp();
const auth = getAuth();

// Funkcja do ustawiania claims dla użytkowników
const setCustomClaims = async (uid: string, requestedRole: string) => {

  try {
    await new Promise(resolve => setTimeout(resolve, 15000));

    await auth.setCustomUserClaims(uid, { role: requestedRole });
    return { success: true };
  } catch (error) {
    throw new HttpsError("internal", `Error setting role: ${requestedRole}`, error);
  }
};

// export const createUser = onCall(
// {
//   enforceAppCheck: true,
// },
// async (request) => {
//   // if (!request.auth || !request.auth.token || !request.auth.token.email) {
//   //   throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
//   // }
//
//   const user = request.data;
//
//    const userCreation= await auth.createUser({
//     displayName: user.displayName,
//     email: user.email,
//      password: user.password
//   })
//
//   const uid = userCreation.uid
//
//   const setClaims = await setCustomClaims(uid, user.role);
//
//    const token = await auth.createCustomToken(uid)
//
//   return setCustomClaims(uid, user.role);
// })


export const setCustomClaimsRole = onCall(
  {
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
      throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
    }

    const requestedRole = request.data;

    return setCustomClaims(request.auth.uid, requestedRole);
  }
);

export const createNewClinic = onCall(
  {
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
      throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
    }

    const db = getFirestore();
    const vetId = request.auth.uid;
    const { name, description, address } = request.data;
    const vetName = request.data.member.name;
    const vetEmail = request.data.member.email;

    if (!name || !address || !vetName || !vetEmail) {
      throw new HttpsError("invalid-argument", "Missing clinic or vet information.", request.data);
    }

    // Przykład ustawiania roli weterynarza

    try {
      const clinicRef = db.collection("clinics").doc(); // create new clinic doc
      const membersRef = clinicRef.collection("members").doc(vetId); // add vet as member

      const batch = db.batch();

      batch.set(clinicRef, {
        name,
        description: description || null,
        address,
        createdAt: FieldValue.serverTimestamp(),
        ownerId: vetId,
      });

      batch.set(membersRef, {
        name: vetName,
        email: vetEmail,
        isAdmin: true,
        joinedAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      const user = await auth.getUser(request.auth.uid)
      user.customClaims
      await auth.setCustomUserClaims(request.auth.uid, {...user.customClaims, clinicId: clinicRef.id});


      return {
        success: true,
        clinicId: clinicRef.id,
      };
    } catch (error) {
      throw new HttpsError("internal", "Failed to create clinic", error as Error);
    }
  }
);
