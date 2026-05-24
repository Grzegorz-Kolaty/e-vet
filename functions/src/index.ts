import {HttpsError, onCall} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
  GeoPoint,
} from "firebase-admin/firestore";
import {sendVerificationEmail} from "./mailer";

initializeApp();

const auth = getAuth();
const db = getFirestore();

/* --------------------------------------------------
   SAFE CLEANER (IMPORTANT)
-------------------------------------------------- */
const clean = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );

/* --------------------------------------------------
   CREATE USER
-------------------------------------------------- */
export const createUser = onCall(
  {enforceAppCheck: true},
  async (request) => {
    const data = request.data ?? {};

    const email = data.email;
    const password = data.password;
    const displayName = data.displayName ?? "";
    const role = data.role ?? "user";

    if (!email || !password) {
      throw new HttpsError(
        "invalid-argument",
        "Email i hasło są wymagane."
      );
    }

    let user_id: string;

    /* ---------------- CREATE AUTH USER ---------------- */
    try {
      const userCreation = await auth.createUser({
        displayName,
        email,
        emailVerified: false,
        password,
      });

      user_id = userCreation.uid;
    } catch (err: any) {
      if (err?.code === "auth/email-already-exists") {
        throw new HttpsError(
          "already-exists",
          "Ten adres email jest już zarejestrowany.",
          err
        );
      }

      throw new HttpsError(
        "internal",
        "Błąd tworzenia konta użytkownika",
        err
      );
    }

    /* ---------------- CUSTOM CLAIMS ---------------- */
    try {
      await auth.setCustomUserClaims(user_id, {
        role,
      });
    } catch (err) {
      throw new HttpsError(
        "internal",
        "Błąd przy ustawianiu ról",
        err
      );
    }

    /* ---------------- EMAIL VERIFICATION ---------------- */
    try {
      const verificationLink =
        await auth.generateEmailVerificationLink(email);

      await sendVerificationEmail(email, verificationLink);
    } catch (err) {
      throw new HttpsError(
        "internal",
        "Błąd wysyłania maila weryfikacyjnego",
        err
      );
    }

    /* ---------------- FIRESTORE WRITE ---------------- */
    try {
      if (role === "vet") {
        await db.collection("vets").doc(user_id).set(
          clean({
            user_id: user_id,
            name: displayName,
            email,
            role,
            clinicId: "",
            createdAt: FieldValue.serverTimestamp(),
            email_verified: false,
            photoUrl: "",
          })
        );
      } else {
        await db.collection("users").doc(user_id).set(
          clean({
            user_id: user_id,
            name: displayName,
            email,
            role,
            createdAt: FieldValue.serverTimestamp(),
            email_verified: false,
            photoUrl: "",
          })
        );
      }
    } catch (error) {
      console.error("Firestore error:", error);
      throw new HttpsError(
        "internal",
        "Błąd zapisu użytkownika w Firestore",
        error
      );
    }

    return {success: true, user_id};
  }
);

/* --------------------------------------------------
   CREATE CLINIC
-------------------------------------------------- */
export const createNewClinic = onCall(
  {enforceAppCheck: true},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "failed-precondition",
        "Użytkownik musi być zalogowany."
      );
    }

    const vetId = request.auth.uid;
    const data = request.data;

    if (!data) {
      throw new HttpsError(
        "invalid-argument",
        "Brak danych kliniki"
      );
    }

    const clinicAddress = request.data.address;

    if (!clinicAddress) {
      throw new HttpsError(
        "invalid-argument",
        "Brak danych adresowych kliniki"
      );
    }

    const clinicName = data.clinicName;

    if (!clinicName) {
      throw new HttpsError(
        "invalid-argument",
        "Brak nazwy kliniki."
      );
    }

    const lat = Number(data.address.latitude);
    const lng = Number(data.address.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new HttpsError(
        "invalid-argument",
        "Błędne współrzędne geograficzne."
      );
    }

    try {
      const clinicRef = db.collection("clinics").doc();
      const vetRef = db.collection("vets").doc(vetId);

      const batch = db.batch();

      /* ---------------- CREATE CLINIC ---------------- */
      batch.set(
        clinicRef,
        clean({
          id: clinicRef.id,
          clinicName,
          ownerId: vetId,
          vetIds: [vetId],
          phoneNumber: data.phoneNumber,
          address: {
            city: clinicAddress.city,
            town: clinicAddress.town,
            village: clinicAddress.village,
            municipality: clinicAddress.municipality,
            searchCity: clinicAddress.searchCity,
            voivodeship: clinicAddress.voivodeship,

            street: clinicAddress.street,
            house_number: clinicAddress.house_number,
            postal_code: clinicAddress.postal_code,
            apartment_number: clinicAddress.apartment_number,

            geojson: JSON.stringify(clinicAddress.geojson),
            latitude: clinicAddress.latitude,
            longitude: clinicAddress.longitude,
          },
          timeOpen: data.timeOpen,
          timeClose: data.timeClose,
          geo: new GeoPoint(lat, lng),
          coverImage: {
            url: ""
          },
          createdAt: FieldValue.serverTimestamp(),
        })
      );

      /* ---------------- UPDATE VET ---------------- */
      batch.update(vetRef, {
        clinicId: clinicRef.id,
      });

      await batch.commit();

      /* ---------------- UPDATE CLAIMS ---------------- */
      try {
        await auth.setCustomUserClaims(vetId, {
          role: "vet",
          clinicId: clinicRef.id,
        });
      } catch (err) {
        console.error("Claims error:", err);
      }

      return {
        clinicId: clinicRef.id,
      };
    } catch (error) {
      console.error("Cloud Function error:", error);

      const message =
        error instanceof Error ? error.message : String(error);

      throw new HttpsError(
        "internal",
        `Wystąpił błąd podczas rejestracji kliniki: ${message}`
      );
    }
  }
);
