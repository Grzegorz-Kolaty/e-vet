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

    return {success: true};
  }
);

export const createNewClinic = onCall(
  {enforceAppCheck: true},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("failed-precondition", "Użytkownik musi być zalogowany.");
    }

    const vetId = request.auth.uid;
    const data = request.data;

    // Podstawowa walidacja pól tekstowych
    if (!data.clinicName || !data.street || !data.houseNumber) {
      throw new HttpsError("invalid-argument", "Brak wymaganych danych adresowych kliniki.");
    }

    // Walidacja i rzutowanie współrzędnych
    const lat = Number(data.latitude);
    const lng = Number(data.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new HttpsError("invalid-argument", "Błędne współrzędne geograficzne.");
    }

    try {
      const clinicRef = db.collection("clinics").doc();
      const batch = db.batch();

      batch.set(clinicRef, {
        clinicName: data.clinicName,
        phoneNumber: data.phoneNumber || null,
        street: data.street,
        houseNumber: data.houseNumber,
        apartmentNumber: data.apartmentNumber || null,
        postcode: data.postcode,
        city: data.city,
        voivodenship: data.voivodenship,

        // GeoPoint wymaga czystych liczb (numbers)
        geo: new GeoPoint(lat, lng),

        geojson: data.geojson || null,
        rawGeoData: data.rawGeoData || null,

        ownerId: vetId,
        clinicCreator: data.clinicCreator,
        createdAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      // Aktualizacja uprawnień (Claims)
      const user = await auth.getUser(vetId);
      await auth.setCustomUserClaims(vetId, {
        ...(user.customClaims ?? {}),
        clinicId: clinicRef.id
      });

      return {clinicId: clinicRef.id};

    } catch (error) {
      console.error("Błąd Cloud Functions:", error);
      throw new HttpsError("internal", "Wystąpił błąd podczas rejestracji kliniki.");
    }
  }
);
