import {HttpsError, onCall} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from 'firebase-admin/app';
import {getFirestore, FieldValue, GeoPoint} from 'firebase-admin/firestore';
import {sendVerificationEmail} from './mailer';

initializeApp();
const auth = getAuth();
const db = getFirestore();


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

    if (user.role === "vet") {
      try {
        await db.collection("vets").doc(uid).set({
          user_id: uid,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          clinicId: "",
          createdAt: FieldValue.serverTimestamp(),
          email_verified: false,
        })
      } catch (error) {
        console.error("Błąd Cloud Functions:", error);
        throw new HttpsError("internal", "Wystąpił błąd podczas tworzenia konta weterynarza.");
      }
    }

    return {success: true};
  }
);

export const createNewClinic = onCall(
  { enforceAppCheck: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "failed-precondition",
        "Użytkownik musi być zalogowany."
      );
    }

    const vetId = request.auth.uid;
    const data = request.data;

    if (!data.clinicName || !data.street || !data.houseNumber) {
      throw new HttpsError(
        "invalid-argument",
        "Brak wymaganych danych adresowych kliniki."
      );
    }

    const lat = Number(data.latitude);
    const lng = Number(data.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new HttpsError(
        "invalid-argument",
        "Błędne współrzędne geograficzne."
      );
    }

    const geo = JSON.stringify(data.geojson);

    try {
      const clinicRef = db.collection("clinics").doc();
      const vetRef = db.collection("vets").doc(vetId);

      const batch = db.batch();

      // 1. CREATE CLINIC
      batch.set(clinicRef, {
        id: clinicRef.id,
        clinicName: data.clinicName,
        phoneNumber: data.phoneNumber || null,
        street: data.street,
        houseNumber: data.houseNumber,
        apartmentNumber: data.apartmentNumber || null,
        postcode: data.postcode,
        city: data.city,
        voivodeship: data.voivodeship,
        latitude: lat,
        longitude: lng,
        timeOpen: data.timeOpen,
        timeClose: data.timeClose,
        geo: new GeoPoint(lat, lng),
        geojson: geo,
        ownerId: vetId,
        coverImage: {
          url: data.coverImage.url || "",
        },
        createdAt: FieldValue.serverTimestamp(),
      });

      // 2. UPDATE VET (spójność danych!)
      batch.update(vetRef, {
        clinicId: clinicRef.id,
      });

      await batch.commit();

      // 3. UPDATE CUSTOM CLAIMS (osobno – Firebase limitation)
      const user = await auth.getUser(vetId);

      await auth.setCustomUserClaims(vetId, {
        ...(user.customClaims ?? {}),
        clinicId: clinicRef.id,
      });

      return {
        clinicId: clinicRef.id,
      };

    } catch (error) {
      console.error("Błąd Cloud Functions:", error);
      throw new HttpsError(
        "internal",
        "Wystąpił błąd podczas rejestracji kliniki."
      );
    }
  }
);
