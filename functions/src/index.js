"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewClinic = exports.setCustomClaimsRole = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("firebase-admin/auth");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
exports.setCustomClaimsRole = (0, https_1.onCall)({
    enforceAppCheck: true,
}, async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
        throw new https_1.HttpsError("failed-precondition", "The function must be called while authenticated.");
    }
    const auth = (0, auth_1.getAuth)();
    const requestedRole = request.data;
    try {
        await auth.setCustomUserClaims(request.auth.uid, { role: requestedRole });
        return { success: true };
    }
    catch (error) {
        throw new https_1.HttpsError("internal", `Error setting role: ${requestedRole}`, error);
    }
});
// interface CreateClinicRequest {
//   name: string;
//   description?: string;
//   address: string;
//   vetName: string;
//   vetEmail: string;
// }
exports.createNewClinic = (0, https_1.onCall)({
    enforceAppCheck: true,
}, async (request) => {
    if (!request.auth || !request.auth.token || !request.auth.token.email) {
        throw new https_1.HttpsError("failed-precondition", "The function must be called while authenticated.");
    }
    const db = (0, firestore_1.getFirestore)();
    const vetId = request.auth.uid;
    const { name, description, address, vetName, vetEmail } = request.data;
    if (!name || !address || !vetName || !vetEmail) {
        throw new https_1.HttpsError("invalid-argument", "Missing clinic or vet information.");
    }
    try {
        const clinicRef = db.collection("clinics").doc(); // create new clinic doc
        const membersRef = clinicRef.collection("members").doc(vetId); // add vet as member
        const batch = db.batch();
        batch.set(clinicRef, {
            name,
            description: description || null,
            address,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            ownerId: vetId,
        });
        batch.set(membersRef, {
            name: vetName,
            email: vetEmail,
            isAdmin: true,
            joinedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        await batch.commit();
        return {
            success: true,
            clinicId: clinicRef.id,
        };
    }
    catch (error) {
        throw new https_1.HttpsError("internal", "Failed to create clinic", error);
    }
});
//# sourceMappingURL=index.js.map