/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {HttpsError, onCall, onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from 'firebase-admin/app';
import {sendEmailVerification} from 'firebase/auth';

initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript


export const setCustomClaims = onRequest(
  {cors: "https://e-vet-szczecin.web.app"},

  async (request, response) => {

    try {

      if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
      }

      const {idToken, role} = request.body.data;

      if (!idToken || !role) {
        response.status(400).send({error: 'Missing idToken or role'});
        return;
      }

      const decodedToken = await getAuth().verifyIdToken(idToken);
      await getAuth().setCustomUserClaims(decodedToken.uid, {role});

      response.status(200).send({
        data: 'data',
        status: 'success',
        message: `Custom claims set for user ${decodedToken.uid}`,
      });

    } catch (error) {
      logger.error('Error setting custom claims', error);
      response.status(500).send({error: 'Internal server error', details: error});
    }
  });



export const setCustomClaimsRole = onCall(
  async (request) => {
    const {uid, role} = request.data

    try {
      return await getAuth().setCustomUserClaims(uid, {role});
    } catch (error) {
      throw new HttpsError("internal", "Error creating user", error);
    }

    // const {email, displayName, password, role} = request.data;
    //
    // if (!email || !password || !role) {
    //   throw new HttpsError("invalid-argument", "Missing required fields");
    // }
    //
    // try {
    //   const userRecord = await getAuth().createUser({
    //     email,
    //     password,
    //     displayName
    //   });
    //
    //   await getAuth().setCustomUserClaims(userRecord.uid, {role});
    //
    //   // await sendEmailVerification(user)
    //
    //
    //   // const user = getAuth().getUserByEmail(email)
    //
    //   const token = await getAuth().createCustomToken(userRecord.uid)
    //
    //   // return {success: true, message: "User created", uid: userRecord.uid, confEmail: email, token: token};
    //   return token
    // } catch (error) {
    //   throw new HttpsError("internal", "Error creating user", error);
    // }
  });


// export const sendCustomVerificationEmail = functions.https.onCall(async (data) => {
//   const { email } = data;
//
//   const actionCodeSettings = {
//     url: "https://your-app.com",
//     handleCodeInApp: true,
//   };
//
//   const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
//
//   // Pobieramy kod weryfikacyjny z linku
//   const oobCode = new URL(link).searchParams.get("oobCode");
//
//   const mailOptions = {
//     from: "your-email@gmail.com",
//     to: email,
//     subject: "Zweryfikuj swoje konto",
//     text: `Twój kod weryfikacyjny to: ${oobCode}. Wpisz go w aplikacji.`,
//   };
//
//   await transporter.sendMail(mailOptions);
//   return { success: true };
// });

// if (!request.auth) {
//   throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
// }
//
//
// const authorizationHeader = request.rawRequest.headers.authorization;
//
// if (!authorizationHeader) {
//   throw new HttpsError("unauthenticated", "Missing Authorization header.");
// }

// const token = authorizationHeader.replace("Bearer ", "").trim();
// await getAuth().verifyIdToken(token)
// const name = request.auth.token.name || null;
// const picture = request.auth.token.picture || null;
// const email = request.auth.token.email || null;
//
// try {
//   const token = request.app.token.toString()
//
//   if (!token) {
//     return new HttpsError("failed-precondition", "notoken", token);
//   }
//   return await getAuth().verifyIdToken(token)
// } catch (error) {
//    logger.error('Error setting custom claims', error);
//    return  error
// }

// try {
//
//   // if (request.method === 'OPTIONS') {
//   //   response.status(204).send('');
//   //   return;
//   // }
//
//   const {idToken, role} = request.data;
//
//   if (!idToken || !role) {
//     return false
//     // return response = "error"
//     // response.send({error: 'Missing idToken or role'});
//     // return;
//   }
//
//   return true
//   // response.status(204).send("");
//
// } catch (error) {
//   logger.error('Error setting custom claims', error);
//   return false
//   // response.status(500).send({error: 'Internal server error', details: error});
// }
