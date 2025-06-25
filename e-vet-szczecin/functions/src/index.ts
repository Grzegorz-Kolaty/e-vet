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
import {getFirestore, FieldValue, GeoPoint} from 'firebase-admin/firestore';
import {sendVerificationEmail} from './mailer';


initializeApp();
const auth = getAuth();


export const createUser = onCall(
  {enforceAppCheck: true},
  async (request) => {
    const user = request.data;
    let uid: string;

    try {
      const userCreation = await auth.createUser({
        displayName: user.displayName,
        email: user.email,
        emailVerified: false,
        password: user.password,
      });
      uid = userCreation.uid;
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        throw new HttpsError("already-exists", "Ten adres email jest już zarejestrowany.", err);
      }
      throw new HttpsError("internal", "Błąd tworzenia konta użytkownika", err);
    }

    try {
      await auth.setCustomUserClaims(uid, {role: user.role});
    } catch (err) {
      throw new HttpsError("internal", "Błąd przy ustawianiu ról", err);
    }

    try {
      const verificationLink = await auth.generateEmailVerificationLink(user.email);
      await sendVerificationEmail(user.email, verificationLink);
    } catch (err) {
      throw new HttpsError("internal", "Błąd wysyłania maila weryfikacyjnego", err);
    }

    return {success: true};
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
    const {name, description, address} = request.data;
    const vetName = request.data.member.name;
    const vetEmail = request.data.member.email;
    const geo = request.data.geo;


    const {latitude, longitude} = geo;

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new HttpsError("invalid-argument", "Współrzędne są poza dopuszczalnym zakresem.");
    }

    const geoPoint = new GeoPoint(latitude, longitude);

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
        geo: geoPoint
      });

      batch.set(membersRef, {
        name: vetName,
        email: vetEmail,
        isAdmin: true,
        joinedAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      const user = await auth.getUser(request.auth.uid)
      await auth.setCustomUserClaims(request.auth.uid, {...user.customClaims, clinicId: clinicRef.id});


      return {clinicId: clinicRef.id};
    } catch (error) {
      throw new HttpsError("internal", "Failed to create clinic", request.data);
    }
  }
);
